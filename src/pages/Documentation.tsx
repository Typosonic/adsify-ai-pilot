import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Code, Target, Zap, Brain, CheckCircle, AlertTriangle } from "lucide-react";

const Documentation = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Adsify Documentation
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          AI-powered Facebook advertising platform that replaces traditional marketing agencies with intelligent automation
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge variant="secondary">React + TypeScript</Badge>
          <Badge variant="secondary">Supabase Backend</Badge>
          <Badge variant="secondary">Facebook Graph API</Badge>
          <Badge variant="secondary">OpenAI Integration</Badge>
        </div>
      </div>

      {/* Mission & Vision */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Mission & Vision
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Mission</h3>
            <p className="text-muted-foreground">
              To democratize digital advertising by providing small to medium businesses with enterprise-level AI-powered 
              Facebook advertising capabilities that traditionally only large agencies could offer.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Vision</h3>
            <p className="text-muted-foreground">
              Replace traditional marketing agencies with AI agents that can create, optimize, and manage Facebook ad 
              campaigns 24/7 with better performance and lower costs.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* What Adsify Does */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            What Adsify Does
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Core Features</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm">AI-powered campaign creation and optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Real-time performance monitoring and insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Competitor analysis and market intelligence</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Automated bid management and budget optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Multi-account management dashboard</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">AI Capabilities</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Brain className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span className="text-sm">Natural language campaign generation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Brain className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span className="text-sm">Predictive performance analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <Brain className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span className="text-sm">Automated A/B testing and optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <Brain className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span className="text-sm">Intelligent audience targeting recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Brain className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span className="text-sm">Dynamic creative optimization</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Architecture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Technical Architecture
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Frontend Stack</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p><strong>Framework:</strong> React 18 + TypeScript</p>
                <p><strong>Build Tool:</strong> Vite</p>
                <p><strong>Styling:</strong> Tailwind CSS + shadcn/ui</p>
                <p><strong>State Management:</strong> React Query + Custom Hooks</p>
              </div>
              <div className="space-y-2">
                <p><strong>Routing:</strong> React Router v6</p>
                <p><strong>Forms:</strong> React Hook Form + Zod</p>
                <p><strong>Charts:</strong> Recharts</p>
                <p><strong>UI Components:</strong> Radix UI primitives</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Backend Infrastructure</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p><strong>Database:</strong> Supabase (PostgreSQL)</p>
                <p><strong>Authentication:</strong> Supabase Auth</p>
                <p><strong>Real-time:</strong> Supabase Realtime</p>
                <p><strong>Storage:</strong> Supabase Storage</p>
              </div>
              <div className="space-y-2">
                <p><strong>Edge Functions:</strong> Deno Runtime</p>
                <p><strong>AI Integration:</strong> OpenAI GPT-4</p>
                <p><strong>External APIs:</strong> Facebook Graph API</p>
                <p><strong>Deployment:</strong> Supabase Edge Network</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Facebook API Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Facebook API Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">API Capabilities</h3>
            <p className="text-muted-foreground mb-4">
              Leveraging Facebook's comprehensive advertising ecosystem through the Graph API to provide full-featured campaign management.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Marketing API Features</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Campaign creation and management</li>
                  <li>• Ad set optimization and targeting</li>
                  <li>• Creative asset management</li>
                  <li>• Real-time performance metrics</li>
                  <li>• Audience insights and analytics</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Advanced Capabilities</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Custom audience creation</li>
                  <li>• Lookalike audience generation</li>
                  <li>• Conversion tracking setup</li>
                  <li>• Attribution modeling</li>
                  <li>• Cross-platform campaign sync</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              <strong>Reference:</strong> 
              <a 
                href="https://developers.facebook.com/social-technologies/ads-monetization/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline ml-1"
              >
                Facebook Ads Monetization Documentation
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Current Implementation Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-green-600 mb-3">✅ Completed Features</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm">
                <li>• User authentication system</li>
                <li>• Dashboard with campaign overview</li>
                <li>• Campaign creation interface</li>
                <li>• Facebook OAuth integration</li>
                <li>• Database schema and RLS policies</li>
              </ul>
              <ul className="space-y-2 text-sm">
                <li>• Performance optimizer with AI insights</li>
                <li>• Competitor analysis tool</li>
                <li>• Settings and profile management</li>
                <li>• Responsive UI with dark/light mode</li>
                <li>• Edge functions infrastructure</li>
              </ul>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-amber-600 mb-3">🚧 Needs Further Implementation</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Critical Backend Services</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Facebook API token refresh mechanism</li>
                  <li>• Real-time campaign performance tracking</li>
                  <li>• Automated optimization algorithms</li>
                  <li>• Advanced analytics and reporting</li>
                  <li>• Webhook handlers for Facebook events</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">AI Enhancement Requirements</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Advanced prompt engineering for better campaign generation</li>
                  <li>• Machine learning models for performance prediction</li>
                  <li>• Natural language processing for competitor analysis</li>
                  <li>• Automated creative generation and testing</li>
                  <li>• Intelligent budget allocation algorithms</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Production Readiness</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Comprehensive error handling and logging</li>
                  <li>• Rate limiting and API quota management</li>
                  <li>• Scalable architecture for multiple users</li>
                  <li>• Security audit and penetration testing</li>
                  <li>• Performance optimization and caching</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Development Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle>Development Roadmap</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Phase 1: Core Functionality (Current)</h3>
            <p className="text-sm text-muted-foreground">
              Establish basic campaign management, Facebook integration, and AI-powered optimization foundation.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Phase 2: Advanced AI Features</h3>
            <p className="text-sm text-muted-foreground">
              Implement sophisticated machine learning models, predictive analytics, and automated optimization strategies.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Phase 3: Scale & Enterprise</h3>
            <p className="text-sm text-muted-foreground">
              Multi-tenant architecture, advanced reporting, white-label solutions, and enterprise integrations.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started for Advanced Development</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Environment Setup</h4>
            <code className="text-sm">
              git clone [repository] && npm install && supabase start
            </code>
          </div>
          <div>
            <h4 className="font-medium mb-2">Key Configuration Files</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• <code>supabase/config.toml</code> - Supabase project configuration</li>
              <li>• <code>src/integrations/supabase/types.ts</code> - Database type definitions</li>
              <li>• <code>tailwind.config.ts</code> - Design system configuration</li>
              <li>• <code>src/index.css</code> - Global styles and CSS variables</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Important Directories</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• <code>supabase/functions/</code> - Edge functions for API integrations</li>
              <li>• <code>src/hooks/</code> - Custom React hooks for data management</li>
              <li>• <code>src/pages/</code> - Main application routes and components</li>
              <li>• <code>supabase/migrations/</code> - Database schema changes</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documentation;