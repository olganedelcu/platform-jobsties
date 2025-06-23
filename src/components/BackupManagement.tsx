import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBackupSystem } from '@/hooks/useBackupSystem';
import FormspreeConfigurationCard from './formspree/FormspreeConfigurationCard';
import { 
  Database, 
  Download, 
  Play, 
  Settings, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  HardDrive,
  BarChart3,
  AlertTriangle,
  Mail
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const BackupManagement = () => {
  const {
    backupLogs,
    backupConfigs,
    backupStats,
    loading,
    performing,
    performBackup,
    updateBackupConfig,
    downloadBackup,
    deleteOldBackups
  } = useBackupSystem();

  const [selectedBackupType, setSelectedBackupType] = useState<string>('database_full');
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const { toast } = useToast();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'completed' ? 'default' : 
                   status === 'failed' ? 'destructive' : 
                   status === 'in_progress' ? 'secondary' : 'outline';
    
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleManualBackup = async () => {
    try {
      await performBackup(selectedBackupType as any, {
        compress: true,
        tables: selectedTables
      });
      toast({
        title: "Success",
        description: "Backup completed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Backup failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const availableTables = [
    'profiles', 'job_applications', 'cv_files', 'module_files',
    'coaching_sessions', 'course_progress', 'coach_todos',
    'weekly_job_recommendations', 'mentee_notes'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p>Loading backup system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">System Management</h2>
        <Button
          onClick={() => deleteOldBackups()}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Clean Old Backups
        </Button>
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Notifications
          </TabsTrigger>
          <TabsTrigger value="backups" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Backups
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <FormspreeConfigurationCard />
        </TabsContent>

        <TabsContent value="backups" className="space-y-4">
          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {backupStats.map((stat) => (
              <Card key={stat.backup_type}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.backup_type.replace('_', ' ')}
                      </p>
                      <p className="text-2xl font-bold">
                        {stat.success_rate.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {stat.backup_count} backups
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-indigo-600" />
                  </div>
                  {stat.last_backup && (
                    <p className="text-xs text-gray-500 mt-2">
                      Last: {format(new Date(stat.last_backup), 'MMM dd, HH:mm')}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="manual" className="space-y-4">
            <TabsList>
              <TabsTrigger value="manual">Manual Backup</TabsTrigger>
              <TabsTrigger value="logs">Backup Logs</TabsTrigger>
              <TabsTrigger value="schedule">Schedule & Config</TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Run Manual Backup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Backup Type</label>
                      <Select value={selectedBackupType} onValueChange={setSelectedBackupType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="database_full">Full Database</SelectItem>
                          <SelectItem value="database_incremental">Incremental Database</SelectItem>
                          <SelectItem value="storage_files">Storage Files</SelectItem>
                          <SelectItem value="critical_tables">Critical Tables</SelectItem>
                          <SelectItem value="manual">Custom Tables</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedBackupType === 'manual' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Select Tables</label>
                        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                          {availableTables.map((table) => (
                            <label key={table} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={selectedTables.includes(table)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedTables([...selectedTables, table]);
                                  } else {
                                    setSelectedTables(selectedTables.filter(t => t !== table));
                                  }
                                }}
                                className="rounded"
                              />
                              <span className="text-sm">{table}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleManualBackup}
                    disabled={performing}
                    className="w-full"
                  >
                    {performing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Backup...
                      </>
                    ) : (
                      <>
                        <Database className="h-4 w-4 mr-2" />
                        Create Backup
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Backup Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {backupLogs.length === 0 ? (
                      <div className="text-center py-8">
                        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No backup logs found</p>
                      </div>
                    ) : (
                      backupLogs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-4">
                            <Database className="h-8 w-8 text-indigo-600" />
                            <div>
                              <h4 className="font-medium capitalize">{log.backup_type.replace('_', ' ')}</h4>
                              <p className="text-sm text-gray-500">
                                Started: {format(new Date(log.started_at), 'MMM dd, yyyy HH:mm')}
                              </p>
                              {log.completed_at && (
                                <p className="text-sm text-gray-500">
                                  Completed: {format(new Date(log.completed_at), 'MMM dd, yyyy HH:mm')}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              {getStatusBadge(log.status)}
                              {log.file_size && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {formatFileSize(log.file_size)}
                                </p>
                              )}
                              {log.error_message && (
                                <p className="text-sm text-red-500 mt-1 max-w-xs truncate" title={log.error_message}>
                                  {log.error_message}
                                </p>
                              )}
                            </div>
                            
                            {log.backup_location && log.status === 'completed' && (
                              <Button
                                onClick={() => downloadBackup(log.backup_location!)}
                                variant="outline"
                                size="sm"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <div className="grid gap-4">
                {backupConfigs.map((config) => (
                  <Card key={config.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          {config.backup_type.replace('_', ' ')}
                        </span>
                        <Switch
                          checked={config.is_enabled}
                          onCheckedChange={(enabled) => 
                            updateBackupConfig(config.id, { is_enabled: enabled })
                          }
                        />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Schedule (Cron)</label>
                          <p className="text-sm text-gray-600 font-mono">{config.schedule_cron}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Retention Days</label>
                          <p className="text-sm text-gray-600">{config.retention_days} days</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Status</label>
                          <Badge variant={config.is_enabled ? 'default' : 'secondary'}>
                            {config.is_enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                      </div>
                      
                      {config.config_data && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Configuration</label>
                          <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                            {JSON.stringify(config.config_data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BackupManagement;
