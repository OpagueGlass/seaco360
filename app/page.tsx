"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import {
  ArrowRight,
  Database,
  Users,
  TrendingUp,
  FileText,
  Activity,
  MapPin,
  Shield,
  BarChart3,
  ChevronDown,
  PieChart,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CountingNumber } from "@/components/ui/counting-number";

const stats = [
  { value: 40000, label: "Participants", suffix: "+" },
  { value: 12000, label: "Households", suffix: "+" },
  { value: 5, label: "Subdistricts Covered", suffix: "" },
  { value: new Date().getFullYear() - 2013, label: "Years of Data", suffix: "+" },
  { value: 50, label: "Academic Publications", suffix: "+" },
];

const features = [
  {
    icon: Database,
    title: "Rich Longitudinal Data",
    description: `Comprehensive health, demographic, and socioeconomic data collected across ${stats[1].value}+ years`,
  },
  {
    icon: History,
    title: "Population Tracking",
    description: "Monitors whole populations over time, accurately capturing trends and turning points",
  },
  {
    icon: MapPin,
    title: "Geographic Coverage",
    description: "Five sub-districts in Johor, Segamat with diverse urban and rural populations",
  },
  {
    icon: Shield,
    title: "Research Ethics",
    description: "Full ethical approval and robust data governance frameworks",
  },
  // {
  //   icon: BarChart3,
  //   title: "Analytics Ready",
  //   description: "Clean, validated datasets ready for statistical analysis and research",
  // },
  {
    icon: Users,
    title: "Community Engaged",
    description: "Strong community partnerships and collaboration with prominent universities around the globe",
  },
  {
    icon: TrendingUp,
    title: "Continuous Updates",
    description: "Regular semi-annual health rounds with ongoing data collection and validation",
  },
];

function FadeInSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    setHeroVisible(true);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden min-h-[calc(100vh-4rem)]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1
                  className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground transition-all duration-1000 ease-out ${
                    heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  SEACO <span className="text-primary">360</span>
                </h1>
                <p
                  className={`text-xl text-muted-foreground leading-relaxed transition-all duration-1000 ease-out delay-200 ${
                    heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: "100ms" }}
                >
                  Presenting longitudinal data captured by our comprehensive Health and Demographic Surveillance System
                  based in Malaysia
                </p>
              </div>

              {/* Stats */}
              <div
                className={`grid grid-cols-3 justify-center sm:grid-cols-5 gap-4 py-6 transition-all duration-1000 ease-out ${
                  heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                {stats.map((stat, i) => (
                  <div key={i} className="text-center sm:text-left space-y-1">
                    <CountingNumber
                      number={stat.value}
                      suffix={stat.suffix}
                      inView={true}
                      transition={{ stiffness: 100, damping: 30 }}
                      className="font-semibold text-2xl sm:text-3xl"
                    />
                    <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div
                className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 ease-out ${
                  heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: "500ms" }}
              >
                <Button size="lg" asChild className="group">
                  <Link href="/brief">
                    Explore Data <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="https://www.monash.edu.my/seaco">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 ${
            heroVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "1000ms" }}
        >
          <ChevronDown className="size-6 text-muted-foreground animate-bounce" />
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <FadeInSection delay={0}>
              <Link href="/brief" className="group block h-full">
                <Card className="h-full overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                        <PieChart className="size-7 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          Community Briefs
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          Updated Monthly
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-base">
                      Interactive visualisations summarising key health and demographic insights from our surveillance
                      data
                    </CardDescription>
                    <div className="flex items-center text-primary font-medium text-sm group-hover:gap-3 gap-2 transition-all">
                      View Briefs <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </FadeInSection>

            <FadeInSection delay={150}>
              <Link href="/round" className="group block h-full">
                <Card className="h-full overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                        <Activity className="size-7 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          Health Rounds
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          Round 2025 Active
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-base">
                      Explore longitudinal health survey data across multiple collection rounds by district
                    </CardDescription>
                    <div className="flex items-center text-primary font-medium text-sm group-hover:gap-3 gap-2 transition-all">
                      Explore Rounds <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </FadeInSection>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <FadeInSection className="max-w-2xl mx-auto text-center space-y-4">
            {/* <Badge variant="outline">Platform Capabilities</Badge> */}
            <h2 className="text-3xl font-bold text-foreground">Why Choose SEACO?</h2>
            <p className="text-muted-foreground text-xl">
              Access high quality surveillance data suited for multidisciplinary research with confidence
            </p>
          </FadeInSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FadeInSection key={index} delay={index * 100}>
                <Card className="group h-full hover:shadow-lg transition-all duration-300 border-muted hover:-translate-y-1">
                  <CardHeader className="space-y-4">
                    <div className="size-11 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <feature.icon className="size-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      <div className="bg-gradient-to-r from-primary to-primary/80 p-8 sm:p-12 text-primary-foreground">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to start your research?</h2>
          <p className="text-primary-foreground/90 text-lg">
            Get access to comprehensive surveillance data for your next research project.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Button size="lg" variant="secondary" asChild className="group">
              <Link href="https://www.monash.edu.my/seaco/research-and-training/how-to-collaborate-with-seaco">
                Request Access
                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            {/* <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link href="/login">Sign In</Link>
            </Button> */}
          </div>
        </div>
      </div>

      <footer className="border-t bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">SEACO</span>
              <Badge variant="secondary">360</Badge>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} South East Asia Community Observatory. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="https://www.monash.edu.my/seaco/research-and-training/authorship-policy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Authorship Policy
              </Link>
              <Link
                href="https://www.monash.edu.my/seaco/contact-us"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
