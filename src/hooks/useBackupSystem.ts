
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BackupLog {
  id: string;
  backup_type: string;
  status: string;
  started_at: string;
  completed_at?: string | null;
  file_size?: number | null;
  backup_location?: string | null;
  error_message?: string | null;
  metadata?: unknown;
  created_at?: string;
}

interface BackupConfiguration {
  id: string;
  backup_type: string;
  schedule_cron: string;
  retention_days: number;
  is_enabled: boolean;
  config_data?: unknown;
  created_at?: string;
  updated_at?: string;
}

interface BackupStatistics {
  backup_type: string;
  last_backup?: string;
  success_rate: number;
  total_size: number;
  backup_count: number;
}

export const useBackupSystem = () => {
  const [backupLogs, setBackupLogs] = useState<BackupLog[]>([]);
  const [backupConfigs, setBackupConfigs] = useState<BackupConfiguration[]>([]);
  const [backupStats, setBackupStats] = useState<BackupStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [performing, setPerforming] = useState(false);
  const { toast } = useToast();

  const fetchBackupLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('backup_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setBackupLogs(data || []);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to fetch backup logs",
        variant: "destructive"
      });
    }
  };

  const fetchBackupConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from('backup_configurations')
        .select('*')
        .order('backup_type');

      if (error) throw error;
      setBackupConfigs(data || []);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to fetch backup configurations",
        variant: "destructive"
      });
    }
  };

  const fetchBackupStatistics = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_backup_statistics');

      if (error) throw error;
      setBackupStats(data || []);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to fetch backup statistics",
        variant: "destructive"
      });
    }
  };

  const performBackup = async (
    type: 'database_full' | 'database_incremental' | 'storage_files' | 'critical_tables' | 'manual',
    options: { compress?: boolean; tables?: string[] } = {}
  ) => {
    setPerforming(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('backup-system', {
        body: {
          type,
          compress: options.compress ?? true,
          tables: options.tables || []
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Success",
          description: `${type.replace('_', ' ')} backup completed successfully`,
        });
        
        // Refresh logs and stats
        await Promise.all([fetchBackupLogs(), fetchBackupStatistics()]);
      } else {
        throw new Error(data.error || 'Backup failed');
      }

      return data.backup;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to perform backup";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    } finally {
      setPerforming(false);
    }
  };

  const updateBackupConfig = async (configId: string, updates: Partial<BackupConfiguration>) => {
    try {
      const { error } = await supabase
        .from('backup_configurations')
        .update(updates as Record<string, unknown>)
        .eq('id', configId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Backup configuration updated successfully",
      });

      await fetchBackupConfigs();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to update backup configuration",
        variant: "destructive"
      });
    }
  };

  const downloadBackup = async (backupLocation: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('backups')
        .download(backupLocation);

      if (error) throw error;

      // Create download link
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = backupLocation.split('/').pop() || 'backup.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Backup file downloaded successfully",
      });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to download backup file",
        variant: "destructive"
      });
    }
  };

  const deleteOldBackups = async (retentionDays: number = 30) => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      // Get old backup logs
      const { data: oldLogs, error: logsError } = await supabase
        .from('backup_logs')
        .select('backup_location')
        .lt('created_at', cutoffDate.toISOString())
        .not('backup_location', 'is', null);

      if (logsError) throw logsError;

      // Delete files from storage
      if (oldLogs && oldLogs.length > 0) {
        const filesToDelete = oldLogs
          .map(log => log.backup_location)
          .filter(location => location !== null);

        if (filesToDelete.length > 0) {
          const { error: deleteError } = await supabase.storage
            .from('backups')
            .remove(filesToDelete);

          if (deleteError) {
            console.warn('Some backup files could not be deleted:', deleteError);
          }
        }
      }

      // Delete old log entries
      const { error: deleteLogsError } = await supabase
        .from('backup_logs')
        .delete()
        .lt('created_at', cutoffDate.toISOString());

      if (deleteLogsError) throw deleteLogsError;

      toast({
        title: "Success",
        description: `Cleaned up backups older than ${retentionDays} days`,
      });

      await fetchBackupLogs();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to clean up old backups",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchBackupLogs(),
          fetchBackupConfigs(),
          fetchBackupStatistics()
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Set up real-time updates for backup logs
  useEffect(() => {
    const channel = supabase
      .channel('backup-logs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'backup_logs'
        },
        () => {
          fetchBackupLogs();
          fetchBackupStatistics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    backupLogs,
    backupConfigs,
    backupStats,
    loading,
    performing,
    performBackup,
    updateBackupConfig,
    downloadBackup,
    deleteOldBackups,
    refreshData: () => Promise.all([fetchBackupLogs(), fetchBackupConfigs(), fetchBackupStatistics()])
  };
};
