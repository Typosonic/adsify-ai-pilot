import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Target, TrendingUp, Zap, Users, Shield, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const features = [
    {
      icon: Target,
      title: "AI Campaign Creation",
      description: "Generate high-converting Facebook ad campaigns in seconds using advanced AI algorithms.",
      highlight: "10x Faster"
    },
    {
      icon: TrendingUp,
      title: "Performance Optimizer",
      description: "Continuous AI monitoring and optimization suggestions to maximize your ROAS.",
      highlight: "Up to 40% ROAS Boost"
    },
    {
      icon: Zap,
      title: "Competitor Intelligence",
      description: "Analyze competitor ads and strategies with AI-powered insights and recommendations.",
      highlight: "Market Edge"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with encrypted data storage and secure API integrations.",
      highlight: "SOC 2 Compliant"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small businesses and entrepreneurs",
      features: [
        "5 AI-generated campaigns per month",
        "Basic performance analytics",
        "Email support",
        "Facebook Ads integration",
        "Campaign download & sync"
      ],
      highlighted: false,
      cta: "Start Free Trial"
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "Ideal for marketing agencies and growing businesses",
      features: [
        "25 AI-generated campaigns per month",
        "Advanced performance optimizer",
        "Competitor spy tools",
        "Priority support",
        "Custom reporting",
        "Team collaboration",
        "API access"
      ],
      highlighted: true,
      cta: "Start Free Trial"
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "For large organizations with advanced needs",
      features: [
        "Unlimited AI campaigns",
        "Full competitor intelligence suite",
        "White-label options",
        "Dedicated success manager",
        "Custom integrations",
        "Advanced analytics",
        "24/7 phone support"
      ],
      highlighted: false,
      cta: "Contact Sales"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Director",
      company: "TechStart Inc",
      content: "Adsify transformed our Facebook advertising. We saw a 45% increase in ROAS within the first month.",
      rating: 5
    },
    {
      name: "Mike Rodriguez", 
      role: "Agency Owner",
      company: "Digital Growth Co",
      content: "The AI-powered campaign creation saves us 15+ hours per week. Our clients love the results.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "E-commerce Manager", 
      company: "Fashion Forward",
      content: "The competitor intelligence feature gives us insights we never had before. Game-changer!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Adsify
            </h1>
            <Badge variant="secondary" className="text-xs">BETA</Badge>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">Reviews</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-primary hover:shadow-custom-md transition-all duration-300" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6">
            🚀 AI-Powered Facebook Advertising Platform
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Replace Your Marketing Agency with{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              AI Automation
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Generate high-converting Facebook ad campaigns in seconds, optimize performance with AI, 
            and spy on competitors—all while saving thousands on agency fees.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:shadow-custom-md transition-all duration-300 px-8 py-6 text-lg"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
              Watch Demo
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10x</div>
              <div className="text-sm text-muted-foreground">Faster Campaign Creation</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success mb-2">40%</div>
              <div className="text-sm text-muted-foreground">Average ROAS Increase</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-warning mb-2">$50K+</div>
              <div className="text-sm text-muted-foreground">Saved on Agency Fees</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful AI Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to dominate Facebook advertising with artificial intelligence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-custom-md transition-all duration-300 border-0 bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.highlight}
                    </Badge>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your business. All plans include a 14-day free trial.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative hover:shadow-custom-lg transition-all duration-300 ${
                  plan.highlighted ? 'border-primary shadow-custom-md scale-105' : 'border-border'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-6 ${
                      plan.highlighted 
                        ? 'bg-gradient-primary hover:shadow-custom-md' 
                        : 'variant-outline'
                    }`}
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by Marketing Leaders</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our customers are saying about their results with Adsify
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-custom-md transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <blockquote className="text-sm leading-relaxed mb-4">
                    "{testimonial.content}"
                  </blockquote>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Facebook Advertising?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of businesses using AI to create better ads, optimize performance, 
              and outperform their competition.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:shadow-custom-md transition-all duration-300 px-8 py-6 text-lg"
                >
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                Schedule Demo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-12 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Adsify
              </h3>
              <p className="text-sm text-muted-foreground">
                AI-powered Facebook advertising platform that replaces traditional marketing agencies.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><Link to="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Adsify. All rights reserved. Built with AI for the future of advertising.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;