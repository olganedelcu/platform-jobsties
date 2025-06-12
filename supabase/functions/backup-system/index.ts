
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BackupRequest {
  type: 'database_full' | 'database_incremental' | 'storage_files' | 'critical_tables' | 'manual'
  compress?: boolean
  tables?: string[]
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { type, compress = true, tables = [] } = await req.json() as BackupRequest

    console.log('Starting backup process:', { type, compress, tables })

    // Log backup start
    const { data: logEntry } = await supabaseClient
      .rpc('log_backup_operation', {
        p_backup_type: type,
        p_status: 'in_progress',
        p_metadata: { compress, tables, started_by: 'system' }
      })

    const backupLogId = logEntry

    try {
      let backupResult
      
      switch (type) {
        case 'database_full':
          backupResult = await performFullDatabaseBackup(supabaseClient, compress)
          break
        case 'database_incremental':
          backupResult = await performIncrementalBackup(supabaseClient, compress)
          break
        case 'storage_files':
          backupResult = await performStorageBackup(supabaseClient, compress)
          break
        case 'critical_tables':
          backupResult = await performCriticalTablesBackup(supabaseClient, tables, compress)
          break
        case 'manual':
          backupResult = await performManualBackup(supabaseClient, tables, compress)
          break
        default:
          throw new Error(`Unknown backup type: ${type}`)
      }

      // Log successful completion
      await supabaseClient
        .rpc('log_backup_operation', {
          p_backup_type: type,
          p_status: 'completed',
          p_backup_location: backupResult.location,
          p_file_size: backupResult.size,
          p_metadata: { 
            ...backupResult.metadata,
            duration_seconds: backupResult.duration 
          }
        })

      console.log('Backup completed successfully:', backupResult)

      return new Response(
        JSON.stringify({ 
          success: true, 
          backup: backupResult,
          logId: backupLogId 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )

    } catch (backupError) {
      console.error('Backup failed:', backupError)
      
      // Log failure
      await supabaseClient
        .rpc('log_backup_operation', {
          p_backup_type: type,
          p_status: 'failed',
          p_error_message: backupError.message,
          p_metadata: { error_details: backupError.toString() }
        })

      throw backupError
    }

  } catch (error) {
    console.error('Backup system error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

async function performFullDatabaseBackup(supabase: any, compress: boolean) {
  const startTime = Date.now()
  
  // Get all tables data
  const tables = [
    'profiles', 'job_applications', 'cv_files', 'module_files', 
    'coaching_sessions', 'course_progress', 'coach_todos', 
    'weekly_job_recommendations', 'mentee_notes', 'coach_mentee_assignments'
  ]
  
  const backupData: any = {}
  let totalRows = 0
  
  for (const table of tables) {
    console.log(`Backing up table: ${table}`)
    const { data, error } = await supabase.from(table).select('*')
    
    if (error) {
      console.warn(`Warning: Could not backup table ${table}:`, error.message)
      continue
    }
    
    backupData[table] = data
    totalRows += data?.length || 0
  }
  
  const backupContent = JSON.stringify({
    backup_type: 'database_full',
    timestamp: new Date().toISOString(),
    tables: backupData,
    metadata: {
      total_tables: Object.keys(backupData).length,
      total_rows: totalRows,
      compressed: compress
    }
  })
  
  const fileName = `database_full_${Date.now()}.json`
  const filePath = `database/${fileName}`
  
  // Upload to storage with correct content type
  const { error: uploadError } = await supabase.storage
    .from('backups')
    .upload(
      filePath, 
      new Blob([backupContent], { type: 'text/plain' }), // Changed from application/json to text/plain
      {
        contentType: 'text/plain',
        upsert: false
      }
    )
  
  if (uploadError) {
    throw new Error(`Failed to upload backup: ${uploadError.message}`)
  }
  
  const duration = Math.round((Date.now() - startTime) / 1000)
  
  return {
    location: filePath,
    size: new Blob([backupContent]).size,
    duration,
    metadata: {
      tables_backed_up: Object.keys(backupData).length,
      total_rows: totalRows,
      compressed: compress
    }
  }
}

async function performIncrementalBackup(supabase: any, compress: boolean) {
  const startTime = Date.now()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  
  const tables = [
    'profiles', 'job_applications', 'cv_files', 'module_files', 
    'coaching_sessions', 'course_progress', 'coach_todos'
  ]
  
  const backupData: any = {}
  let totalRows = 0
  
  for (const table of tables) {
    console.log(`Backing up recent changes for table: ${table}`)
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .gte('updated_at', yesterday.toISOString())
    
    if (error) {
      console.warn(`Warning: Could not backup table ${table}:`, error.message)
      continue
    }
    
    if (data && data.length > 0) {
      backupData[table] = data
      totalRows += data.length
    }
  }
  
  const backupContent = JSON.stringify({
    backup_type: 'database_incremental',
    timestamp: new Date().toISOString(),
    since: yesterday.toISOString(),
    tables: backupData,
    metadata: {
      total_tables: Object.keys(backupData).length,
      total_rows: totalRows,
      compressed: compress
    }
  })
  
  const fileName = `database_incremental_${Date.now()}.json`
  const filePath = `incremental/${fileName}`
  
  const { error: uploadError } = await supabase.storage
    .from('backups')
    .upload(
      filePath, 
      new Blob([backupContent], { type: 'text/plain' }),
      {
        contentType: 'text/plain',
        upsert: false
      }
    )
  
  if (uploadError) {
    throw new Error(`Failed to upload incremental backup: ${uploadError.message}`)
  }
  
  const duration = Math.round((Date.now() - startTime) / 1000)
  
  return {
    location: filePath,
    size: new Blob([backupContent]).size,
    duration,
    metadata: {
      tables_backed_up: Object.keys(backupData).length,
      total_rows: totalRows,
      since: yesterday.toISOString()
    }
  }
}

async function performStorageBackup(supabase: any, compress: boolean) {
  const startTime = Date.now()
  
  // List all files in cv-files and module-files buckets
  const buckets = ['cv-files', 'module-files']
  const filesList: any[] = []
  
  for (const bucket of buckets) {
    const { data: files, error } = await supabase.storage
      .from(bucket)
      .list()
    
    if (error) {
      console.warn(`Warning: Could not list files in bucket ${bucket}:`, error.message)
      continue
    }
    
    if (files) {
      filesList.push(...files.map((file: any) => ({ ...file, bucket })))
    }
  }
  
  const backupManifest = {
    backup_type: 'storage_files',
    timestamp: new Date().toISOString(),
    buckets_scanned: buckets,
    files: filesList,
    metadata: {
      total_files: filesList.length,
      total_size: filesList.reduce((sum, file) => sum + (file.metadata?.size || 0), 0),
      compressed: compress
    }
  }
  
  const manifestContent = JSON.stringify(backupManifest)
  const fileName = `storage_manifest_${Date.now()}.json`
  const filePath = `storage/${fileName}`
  
  const { error: uploadError } = await supabase.storage
    .from('backups')
    .upload(
      filePath, 
      new Blob([manifestContent], { type: 'text/plain' }),
      {
        contentType: 'text/plain',
        upsert: false
      }
    )
  
  if (uploadError) {
    throw new Error(`Failed to upload storage manifest: ${uploadError.message}`)
  }
  
  const duration = Math.round((Date.now() - startTime) / 1000)
  
  return {
    location: filePath,
    size: new Blob([manifestContent]).size,
    duration,
    metadata: {
      buckets_backed_up: buckets.length,
      files_catalogued: filesList.length
    }
  }
}

async function performCriticalTablesBackup(supabase: any, tables: string[], compress: boolean) {
  const startTime = Date.now()
  
  const criticalTables = tables.length > 0 ? tables : [
    'profiles', 'job_applications', 'cv_files', 'module_files', 'coaching_sessions', 'course_progress'
  ]
  
  const backupData: any = {}
  let totalRows = 0
  
  for (const table of criticalTables) {
    console.log(`Backing up critical table: ${table}`)
    const { data, error } = await supabase.from(table).select('*')
    
    if (error) {
      console.warn(`Warning: Could not backup critical table ${table}:`, error.message)
      continue
    }
    
    backupData[table] = data
    totalRows += data?.length || 0
  }
  
  const backupContent = JSON.stringify({
    backup_type: 'critical_tables',
    timestamp: new Date().toISOString(),
    tables: backupData,
    metadata: {
      total_tables: Object.keys(backupData).length,
      total_rows: totalRows,
      compressed: compress
    }
  })
  
  const fileName = `critical_tables_${Date.now()}.json`
  const filePath = `critical/${fileName}`
  
  const { error: uploadError } = await supabase.storage
    .from('backups')
    .upload(
      filePath, 
      new Blob([backupContent], { type: 'text/plain' }),
      {
        contentType: 'text/plain',
        upsert: false
      }
    )
  
  if (uploadError) {
    throw new Error(`Failed to upload critical tables backup: ${uploadError.message}`)
  }
  
  const duration = Math.round((Date.now() - startTime) / 1000)
  
  return {
    location: filePath,
    size: new Blob([backupContent]).size,
    duration,
    metadata: {
      critical_tables_backed_up: Object.keys(backupData).length,
      total_rows: totalRows
    }
  }
}

async function performManualBackup(supabase: any, tables: string[], compress: boolean) {
  const startTime = Date.now()
  
  if (tables.length === 0) {
    return performFullDatabaseBackup(supabase, compress)
  }
  
  const backupData: any = {}
  let totalRows = 0
  
  for (const table of tables) {
    console.log(`Backing up selected table: ${table}`)
    const { data, error } = await supabase.from(table).select('*')
    
    if (error) {
      console.warn(`Warning: Could not backup table ${table}:`, error.message)
      continue
    }
    
    backupData[table] = data
    totalRows += data?.length || 0
  }
  
  const backupContent = JSON.stringify({
    backup_type: 'manual',
    timestamp: new Date().toISOString(),
    tables: backupData,
    metadata: {
      total_tables: Object.keys(backupData).length,
      total_rows: totalRows,
      compressed: compress
    }
  })
  
  const fileName = `manual_backup_${Date.now()}.json`
  const filePath = `manual/${fileName}`
  
  const { error: uploadError } = await supabase.storage
    .from('backups')
    .upload(
      filePath, 
      new Blob([backupContent], { type: 'text/plain' }),
      {
        contentType: 'text/plain',
        upsert: false
      }
    )
  
  if (uploadError) {
    throw new Error(`Failed to upload manual backup: ${uploadError.message}`)
  }
  
  const duration = Math.round((Date.now() - startTime) / 1000)
  
  return {
    location: filePath,
    size: new Blob([backupContent]).size,
    duration,
    metadata: {
      tables_backed_up: Object.keys(backupData).length,
      total_rows: totalRows
    }
  }
}
