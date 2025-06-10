import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { cloneElement, isValidElement } from "react"
import { Github, Linkedin, Mail, ExternalLink, Download } from "lucide-react"

export const metadata: Metadata = {
  title: "Stephanie McCumsey | Frontend Engineer",
  description:
    "Portfolio of Stephanie McCumsey, a frontend engineer specializing in React, TypeScript, and modern web technologies.",
  keywords: ["frontend engineer", "react developer", "web developer", "javascript", "typescript", "portfolio"],
  authors: [{ name: "Stephanie McCumsey" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://smccumsey.com",
    title: "Stephanie McCumsey | Frontend Engineer",
    description:
      "Portfolio of Stephanie McCumsey, a frontend engineer specializing in React, TypeScript, and modern web technologies.",
    images: [
      {
        url: "/cartoon-headshot.jpeg",
        width: 1200,
        height: 630,
        alt: "Stephanie McCumsey - Frontend Engineer",
      },
    ],
  },
}

function Badge({
  variant = 'default',
  className,
  children
}: {
  variant?: "outline" | "secondary" | 'default'
  className?: string
  children: React.ReactNode
}) {
  const variants = {
    default: "",
    outline: "text-foreground",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  }
  return (
    <span
      className={`inline-flex items-center rounded-full border ${variants[variant]} px-2.5 py-0.5 text-xs font-semibold ${className}`}
    >
      {children}
    </span>
  )
}

function Button({
  variant = 'default',
  className,
  children,
  size,
  asChild = false
}: {
  variant?: "outline" | "secondary" | 'default'
  className?: string
  children?: React.ReactNode
  size?: "sm" | "md" | "lg"
  asChild?: boolean
}) {
  const variants = {
    default: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2",
    outline: "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  }

  const childVariants = {
    default: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2",
    outline: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2",
    secondary: ""
  }
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  const buttonClasses = "items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
  if (asChild) {
    if (!isValidElement(children)) {
      return children;
    }
    const childProps = children.props as { className?: string };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return cloneElement<any>(children, {
      className: `${buttonClasses} ${sizes[size || "md"]} ${childVariants[variant]} ${childProps.className || ""}`
    })
  }

  return (
    <button
      className={`${buttonClasses} ${sizes[size || "md"]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}


export default function Portfolio() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Stephanie McCumsey</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="#about" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link href="#skills" className="text-sm font-medium transition-colors hover:text-primary">
              Skills
            </Link>
            <Link href="#projects" className="text-sm font-medium transition-colors hover:text-primary">
              Projects
            </Link>
            <Link href="#experience" className="text-sm font-medium transition-colors hover:text-primary">
              Experience
            </Link>
            <Link href="#contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Download className="mr-2 h-4 w-4" />
            Resume
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32 space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="space-y-4 md:w-2/3">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Hi, I&apos;m Stephanie
                <span className="block text-primary">Frontend Engineer</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                I build accessible, user-friendly web applications with modern technologies.
              </p>
              <div className="flex gap-4">
                <Button asChild>
                  <Link href="#contact">Get in touch</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="#projects">View my work</Link>
                </Button>
              </div>
              <div className="flex gap-4 pt-4">
                <Link href="https://github.com/smccumsey" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
                  <Github className="h-6 w-6" />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/stephaniemccumsey/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="h-6 w-6" />
                </Link>
                <Link href="mailto:smccumsey@gmail.com" aria-label="Email Me">
                  <Mail className="h-6 w-6" />
                </Link>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-primary">
                <Image
                  src="/cartoon-headshot.jpeg"
                  alt="Stephanie McCumsey"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="bg-muted py-12 md:py-24">
          <div className="container space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">About Me</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              <p>
                I&apos;m a passionate frontend engineer with 5+ years of experience building responsive, accessible web
                applications. I specialize in React, TypeScript, and modern frontend technologies.
              </p>
              <p>
                My approach combines technical expertise with a strong focus on user experience and accessibility. I
                believe in writing clean, maintainable code that delivers exceptional user experiences across all
                devices.
              </p>
              <p>
                When I&apos;m not coding, you can find me hiking, reading about new technologies, or contributing to
                open-source projects.
              </p>
            </div>
          </div>
        </section>

        <section id="skills" className="py-12 md:py-24">
          <div className="container space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">
              Skills & Technologies
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                "HTML5",
                "CSS3",
                "JavaScript",
                "TypeScript",
                "React",
                "Next.js",
                "Tailwind CSS",
                "Redux",
                "GraphQL",
                "Node.js",
                "Git",
                "Figma",
                "Jest",
                "React Testing Library",
                "Webpack",
                "Accessibility",
              ].map((skill) => (
                <Badge key={skill} variant="outline" className="justify-center py-2 text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="bg-muted py-12 md:py-24">
          <div className="container space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">
              Featured Projects
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "E-commerce Platform",
                  description:
                    "A fully responsive e-commerce platform built with Next.js and Tailwind CSS. Features include product filtering, cart functionality, and user authentication.",
                  technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe"],
                  image: "/placeholder.svg?height=200&width=400",
                },
                {
                  title: "Dashboard UI",
                  description:
                    "An accessible admin dashboard with dark mode support, data visualization, and responsive design for all device sizes.",
                  technologies: ["React", "TypeScript", "Tailwind CSS", "Chart.js"],
                  image: "/placeholder.svg?height=200&width=400",
                },
                {
                  title: "Task Management App",
                  description:
                    "A drag-and-drop task management application with real-time updates and collaborative features.",
                  technologies: ["React", "TypeScript", "Redux", "Firebase"],
                  image: "/placeholder.svg?height=200&width=400",
                },
              ].map((project, index) => (
                <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                  <div className="relative aspect-video">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="pt-4">
                      <Button variant="outline" size="sm" className="gap-2">
                        View Project <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="py-12 md:py-24">
          <div className="container space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">Work Experience</h2>
            <div className="max-w-3xl mx-auto space-y-8">
              {[
                {
                  "role": "Software Engineer",
                  "company": "Atlassian (Trello)",
                  "period": "2021 – 2025",
                  "description": "Software engineering role focused on web development and maintenance",
                  "achievements": [
                    "Led a project to replace Redux usage with GraphQL across the web codebase",
                    "Presented on Jest and React Testing Library at company front end forum",
                    "Reduced dependency debt by over half for a project led across repos owned by the team",
                    "Maintained the Trello desktop app and improved documentation after the previous owners left the team"
                  ]
                },
                {
                  "role": "Software Engineer",
                  "company": "Splunk",
                  "period": "2019 – 2021",
                  "description": "Software engineering role involving API development and front-end work",
                  "achievements": [
                    "Developed a GraphQL API using Apollo Server and consumed by a React app",
                    "Steered front-end development for an internal customer support interface built from an OpenAPI definition and architected to follow compliance requirements",
                    "Maintained and grew the marketing site for VictorOps (Splunk acquiree)"
                  ]
                },
                {
                  "role": "Software Developer",
                  "company": "PenLink",
                  "period": "2018 – 2019",
                  "description": "Software development role focusing on CI/CD, data visualization, and access control",
                  "achievements": [
                    "Set up a CI/CD pipeline that relied on unit tests passing and deployed to AWS",
                    "Worked on building performant data visualizations using SVG and Vue JS",
                    "Created access control logic within a web app to restrict certain features to different subscription tiers"
                  ]
                },
                {
                  "role": "Front-End Developer",
                  "company": "Imagination International",
                  "period": "2017 – 2018",
                  "description": "Front-end development role supporting various web applications and processes",
                  "achievements": [
                    "Built a chat system with Vue JS and Firebase for messaging in an online classroom prototype",
                    "Supported custom development request for marketing websites and accounting software",
                    "Spearheaded a code review process amongst development team"
                  ]
                },
              ].map((job, index) => (
                <div key={index} className="border-l-4 border-primary pl-4 space-y-2">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <h3 className="text-xl font-bold">{job.role}</h3>
                    <Badge key={job.period} variant="outline">{job.period}</Badge>
                  </div>
                  <p className="text-lg text-primary">{job.company}</p>
                  <p className="text-muted-foreground">{job.description}</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {job.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-muted py-12 md:py-24">
          <div className="container space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">Get In Touch</h2>
            <div className="max-w-md mx-auto space-y-4">
              <p className="text-center text-muted-foreground">
                I&apos;m currently open to new opportunities. Feel free to reach out if you&apos;d like to work together!
              </p>
              <div className="flex flex-col gap-4">
                <Button asChild className="gap-2">
                  <Link href="mailto:smccumsey@gmail.com">
                    <Mail className="h-4 w-4" /> smccumsey@gmail.com
                  </Link>
                </Button>
                <Button variant="outline" asChild className="gap-2">
                  <Link href="https://www.linkedin.com/in/stephaniemccumsey/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4" /> LinkedIn Profile
                  </Link>
                </Button>
                <Button variant="outline" asChild className="gap-2">
                  <Link href="https://github.com/smccumsey" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" /> GitHub Profile
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Stephanie McCumsey. All rights reserved.</p>
          <nav className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
