
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Building, MapPin, DollarSign, TrendingUp } from 'lucide-react';

const JobTrackingDashboard = () => {
  const jobApplications = [
    {
      id: 1,
      company: "TechCorp Inc.",
      position: "Senior Product Manager",
      location: "San Francisco, CA",
      salary: "$120K - $150K",
      status: "Interview",
      stage: 3,
      totalStages: 4,
      appliedDate: "2 days ago",
      statusColor: "bg-blue-500",
      progress: 75
    },
    {
      id: 2,
      company: "StartupXYZ",
      position: "UX Designer",
      location: "Remote",
      salary: "$90K - $110K",
      status: "Applied",
      stage: 1,
      totalStages: 3,
      appliedDate: "1 week ago",
      statusColor: "bg-yellow-500",
      progress: 33
    },
    {
      id: 3,
      company: "BigTech Solutions",
      position: "Data Scientist",
      location: "Seattle, WA",
      salary: "$130K - $160K",
      status: "Offer",
      stage: 4,
      totalStages: 4,
      appliedDate: "3 weeks ago",
      statusColor: "bg-green-500",
      progress: 100
    }
  ];

  const stats = [
    { label: "Applications", value: "24", change: "+12%", icon: TrendingUp },
    { label: "Interviews", value: "8", change: "+25%", icon: Clock },
    { label: "Offers", value: "3", change: "+200%", icon: CheckCircle },
    { label: "Response Rate", value: "67%", change: "+15%", icon: DollarSign }
  ];

  return (
    <div className="relative w-full max-w-4xl">
      {/* Main Dashboard Card */}
      <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Job Application Tracker</h3>
              <p className="text-gray-600">Track your applications and progress</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Updates</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-5 w-5 text-gray-600" />
                  <span className="text-xs text-green-600 font-medium">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Recent Applications</h4>
          
          {jobApplications.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <Building className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">{job.position}</h5>
                      <p className="text-sm text-gray-600">{job.company}</p>
                    </div>
                  </div>
                  <Badge className={`${job.statusColor} text-white px-3 py-1`}>
                    {job.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Stage {job.stage} of {job.totalStages}</span>
                    <span>{job.appliedDate}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${job.statusColor}`}
                      style={{ width: `${job.progress}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Items */}
        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
          <h5 className="font-semibold text-gray-900 mb-3">Today's Action Items</h5>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Follow up with TechCorp Inc. for interview feedback</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Prepare for final round at BigTech Solutions</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Send thank you email to StartupXYZ recruiter</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Notifications */}
      <div className="absolute -top-4 -right-4 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg animate-bounce">
        New Interview Scheduled!
      </div>
      <div className="absolute -bottom-4 -left-4 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
        3 New Job Matches
      </div>
    </div>
  );
};

export default JobTrackingDashboard;
