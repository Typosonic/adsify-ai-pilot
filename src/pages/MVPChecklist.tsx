import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Circle, Clock, AlertTriangle, Target, Rocket } from "lucide-react";

const MVPChecklist = () => {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      title: "Set Up Project Environment",
      status: "in-progress",
      priority: "high",
      estimate: "2-3 days",
      description: "Prepare development environment for scalable engineering",
      tasks: [
        { id: "1.1", text: "Initialize monorepo structure", completed: false },
        { id: "1.2", text: "Configure TypeScript, ESLint, Prettier", completed: false },
        { id: "1.3", text: "Set up Supabase project with Auth", completed: false },
        { id: "1.4", text: "Create Users and Connections tables", completed: false },
        { id: "1.5", text: "Connect frontend to Supabase (React Query)", completed: false },
        { id: "1.6", text: "Deploy initial skeleton to Vercel", completed: false }
      ],
      acceptanceCriteria: [
        "Local dev environment works end-to-end",
        "Base database tables created and connected"
      ]
    },
    {
      id: 2,
      title: "Facebook OAuth Integration",
      status: "pending",
      priority: "high",
      estimate: "3-4 days",
      description: "Allow users to connect their Facebook Ads account",
      tasks: [
        { id: "2.1", text: "Set up Facebook App with Marketing API permissions", completed: false },
        { id: "2.2", text: "Build OAuth flow with redirect", completed: false },
        { id: "2.3", text: "Store access tokens securely in Supabase", completed: false },
        { id: "2.4", text: "Handle token refresh logic", completed: false }
      ],
      acceptanceCriteria: [
        "User can connect Facebook Ads account successfully",
        "Tokens are stored and retrievable for API calls"
      ]
    },
    {
      id: 3,
      title: "Facebook Ads Dashboard API & Frontend",
      status: "pending",
      priority: "high",
      estimate: "4-5 days",
      description: "Display live campaign data on user dashboard",
      tasks: [
        { id: "3.1", text: "Backend endpoint for Facebook Marketing API calls", completed: false },
        { id: "3.2", text: "Fetch campaigns, ad sets, ads data", completed: false },
        { id: "3.3", text: "Process data (spend, impressions, ROAS)", completed: false },
        { id: "3.4", text: "Frontend metrics summary cards", completed: false },
        { id: "3.5", text: "Graphs for spend and ROAS over time", completed: false },
        { id: "3.6", text: "Active campaigns table", completed: false }
      ],
      acceptanceCriteria: [
        "Dashboard loads real user data within 2 seconds",
        "Visual graphs and tables match design mockups"
      ]
    },
    {
      id: 4,
      title: "Campaign Creation Agent",
      status: "pending",
      priority: "high",
      estimate: "5-6 days",
      description: "Enable users to generate ad campaigns using AI",
      tasks: [
        { id: "4.1", text: "Backend endpoint /api/create-campaign", completed: false },
        { id: "4.2", text: "Integrate Claude/GPT-4 for ad generation", completed: false },
        { id: "4.3", text: "Generate headlines, primary texts, CTAs", completed: false },
        { id: "4.4", text: "Frontend input form for campaign details", completed: false },
        { id: "4.5", text: "Display generated ad copy suggestions", completed: false },
        { id: "4.6", text: "Upload creatives section", completed: false },
        { id: "4.7", text: "Launch Ad button (Facebook Marketing API)", completed: false }
      ],
      acceptanceCriteria: [
        "Users can generate ads within 10 seconds",
        "Ads are launched to Facebook account with correct structure"
      ]
    },
    {
      id: 5,
      title: "Optimizer Agent",
      status: "pending",
      priority: "medium",
      estimate: "4-5 days",
      description: "Analyze campaigns for actionable AI recommendations",
      tasks: [
        { id: "5.1", text: "Scheduled backend job (every 6h)", completed: false },
        { id: "5.2", text: "Fetch active campaigns from Facebook", completed: false },
        { id: "5.3", text: "Process data with Claude/GPT-4 for insights", completed: false },
        { id: "5.4", text: "Store insights in optimizer_insights table", completed: false },
        { id: "5.5", text: "Frontend module to display insights", completed: false }
      ],
      acceptanceCriteria: [
        "Optimizer runs daily with accurate suggestions",
        "Users can view insights clearly on frontend"
      ]
    },
    {
      id: 6,
      title: "Competitor Spy Tool",
      status: "pending",
      priority: "medium",
      estimate: "3-4 days",
      description: "Analyze competitor ads and provide AI insights",
      tasks: [
        { id: "6.1", text: "Backend endpoint /api/spy-competitor", completed: false },
        { id: "6.2", text: "Call Facebook Ads Library API", completed: false },
        { id: "6.3", text: "Process ads with Claude/GPT-4 analysis", completed: false },
        { id: "6.4", text: "Store results in spy_results table", completed: false },
        { id: "6.5", text: "Frontend page to display ads and insights", completed: false }
      ],
      acceptanceCriteria: [
        "Users can analyze competitor ads in under 20 seconds",
        "AI insights provide actionable strategies"
      ]
    },
    {
      id: 7,
      title: "Deployment & QA",
      status: "pending",
      priority: "high",
      estimate: "2-3 days",
      description: "Deploy MVP to production with testing",
      tasks: [
        { id: "7.1", text: "Set up CI/CD pipeline GitHub to Vercel", completed: false },
        { id: "7.2", text: "End-to-end tests for each agent endpoint", completed: false },
        { id: "7.3", text: "Frontend polish (loading states, errors)", completed: false },
        { id: "7.4", text: "Security review (tokens, API keys)", completed: false },
        { id: "7.5", text: "User onboarding flow for live tests", completed: false }
      ],
      acceptanceCriteria: [
        "Production deployment is stable",
        "All tests pass with >95% coverage on core functions"
      ]
    }
  ]);

  const toggleTask = (ticketId: number, taskId: string) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? {
            ...ticket,
            tasks: ticket.tasks.map(task => 
              task.id === taskId ? { ...task, completed: !task.completed } : task
            )
          }
        : ticket
    ));
  };

  const updateTicketStatus = (ticketId: number, newStatus: string) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "in-progress": return Clock;
      case "pending": return Circle;
      default: return Circle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "success";
      case "in-progress": return "warning";
      case "pending": return "secondary";
      default: return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const calculateProgress = () => {
    const totalTasks = tickets.reduce((sum, ticket) => sum + ticket.tasks.length, 0);
    const completedTasks = tickets.reduce((sum, ticket) => 
      sum + ticket.tasks.filter(task => task.completed).length, 0
    );
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const completedTickets = tickets.filter(ticket => 
    ticket.tasks.every(task => task.completed)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Target className="mr-3 h-8 w-8 text-primary" />
            MVP Checklist
          </h1>
          <p className="text-muted-foreground">Track Phase 1 development progress to production</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            {completedTickets}/{tickets.length} Tickets Complete
          </Badge>
          <Button className="bg-gradient-primary hover:shadow-custom-md transition-all duration-300">
            <Rocket className="mr-2 h-4 w-4" />
            Deploy to Production
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="hover:shadow-custom-md transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Overall Progress</span>
            <span className="text-2xl font-bold text-primary">{calculateProgress()}%</span>
          </CardTitle>
          <CardDescription>Track completion across all MVP tickets</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={calculateProgress()} className="h-3 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-success">{completedTickets}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">
                {tickets.filter(t => t.status === "in-progress").length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-muted-foreground">
                {tickets.filter(t => t.status === "pending").length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {tickets.map((ticket) => {
          const StatusIcon = getStatusIcon(ticket.status);
          const completedTasksCount = ticket.tasks.filter(task => task.completed).length;
          const taskProgress = (completedTasksCount / ticket.tasks.length) * 100;

          return (
            <Card key={ticket.id} className="hover:shadow-custom-md transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <StatusIcon className={`h-6 w-6 text-${getStatusColor(ticket.status)}`} />
                    <div>
                      <CardTitle className="text-lg">
                        Ticket {ticket.id}: {ticket.title}
                      </CardTitle>
                      <CardDescription>{ticket.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={ticket.priority === "high" ? "destructive" : ticket.priority === "medium" ? "warning" : "secondary"}>
                      {ticket.priority} priority
                    </Badge>
                    <Badge variant="outline">{ticket.estimate}</Badge>
                    <Badge variant={ticket.status === "completed" ? "success" : ticket.status === "in-progress" ? "warning" : "secondary"}>
                      {ticket.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {completedTasksCount}/{ticket.tasks.length} tasks
                    </span>
                  </div>
                  <Progress value={taskProgress} className="h-2" />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Tasks */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Tasks</h4>
                  {ticket.tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => toggleTask(ticket.id, task.id)}
                    >
                      {task.completed ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span 
                        className={`text-sm ${
                          task.completed 
                            ? "line-through text-muted-foreground" 
                            : "text-foreground"
                        }`}
                      >
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Acceptance Criteria */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Acceptance Criteria</h4>
                  {ticket.acceptanceCriteria.map((criteria, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <AlertTriangle className="h-3 w-3 text-warning mt-1 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">{criteria}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateTicketStatus(ticket.id, "in-progress")}
                    disabled={ticket.status === "in-progress"}
                  >
                    Start Working
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateTicketStatus(ticket.id, "completed")}
                    disabled={completedTasksCount !== ticket.tasks.length}
                  >
                    Mark Complete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Production Readiness */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Rocket className="mr-2 h-5 w-5" />
            Production Readiness Checklist
          </CardTitle>
          <CardDescription>
            Complete these requirements before launching to users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            "All 7 tickets completed with acceptance criteria met",
            "End-to-end testing with real Facebook accounts",
            "Security audit completed (token encryption, API keys)",
            "Performance testing (2s dashboard load time)",
            "Error handling and loading states implemented",
            "User onboarding flow tested",
            "Production deployment pipeline verified"
          ].map((requirement, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Circle className="h-3 w-3 text-primary" />
              <span className="text-sm">{requirement}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default MVPChecklist;