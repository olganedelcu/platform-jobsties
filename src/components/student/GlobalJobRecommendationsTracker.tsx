import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink, Building2, Calendar, User, Search, Briefcase } from 'lucide-react';
import { GlobalJobRecommendation } from '@/hooks/useGlobalJobRecommendations';

interface GlobalJobRecommendationsTrackerProps {
  recommendations: GlobalJobRecommendation[];
  loading: boolean;
}

const GlobalJobRecommendationsTracker: React.FC<GlobalJobRecommendationsTrackerProps> = ({
  recommendations,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecommendations = recommendations.filter(rec => 
    rec.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (rec.description && rec.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Global Job Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading recommendations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Global Job Recommendations
        </CardTitle>
        <CardDescription>
          All job positions recommended by coaches to mentees
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, company, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredRecommendations.length === 0 ? (
          <div className="text-center py-8">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              {searchTerm ? 'No recommendations match your search.' : 'No job recommendations found.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecommendations.map((rec) => (
              <Card key={rec.id} className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{rec.job_title}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Building2 className="h-4 w-4" />
                        <span>{rec.company_name}</span>
                      </div>
                    </div>
                    <Badge variant={rec.status === 'active' ? 'default' : 'secondary'}>
                      {rec.status}
                    </Badge>
                  </div>

                  {rec.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {rec.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    {rec.mentee && (
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>
                          For: {rec.mentee.first_name} {rec.mentee.last_name}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(rec.week_start_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(rec.job_link, '_blank')}
                    className="w-full sm:w-auto"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Job Posting
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GlobalJobRecommendationsTracker;
