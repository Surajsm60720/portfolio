import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import Link from "next/link"

export default function Projects() {
  const projects = [
    {
      title: "TravelEase",
      description:
        "A travel planning web application that allows users to plan trips, explore new destinations, track expenses and find stops along the way.",
      tags: ["React", "Google Maps API", "Supabase", "Tailwind CSS"],
      codeLink: "https://github.com/surajsm60720/travelease",
      liveLink: "https://travel-ease-mocha.vercel.app/",
    },
    {
      title: "CIE Marks Calculator",
      description: "An Android application that takes in an Excel sheet with names and unique IDs of students and allows for easy marks entry for each tests.",
      tags: ["Android", "Kotlin", "Excel"],
      codeLink: "https://github.com/surajsm60720/CIEMarksCalculator",
      liveLink: null,
    },
    {
      title: "Linux Starter Pack",
      description:
        "A terminal user interface for Linux that allows users to select and install applications based on the Linux distribution and also save the list in a bash file for later use. It also has a website to showcase the project.",
      tags: ["Python", "Bash", "TUI", "Next.js", "Tailwind CSS"],
      codeLink: "https://github.com/surajsm60720/linux-starter-pack",
      liveLink: "https://linuxstarterpack.vercel.app/",
    },
    {
      title: "QuizGo",
      description: "A web application that allows admins to create quizzes and monitor the responses of students. Students can take quizzes and view their scores.",
      tags: ["Next.js", "Tailwind CSS", "Firebase"],
      codeLink: "https://github.com/suvanbanerjee/QuizGo",
      liveLink: "https://dscequiz.vercel.app/",
    },
    {
      title: "Namma Lakes",
      description: "A framework for real time analysis and montoring of the physicochemical parameters of lakes using a distributed IoT system.",
      tags: ["Python", "FastAPI", "React", "PostgreSQL", "Docker"],
      codeLink: "https://github.com/nammalakes",
      liveLink: "https://nammalakes.github.io/",
    },
  ]

  return (
    <section id="projects" className="py-20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Projects</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              A selection of my personal and professional projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {projects.map((project, index) => (
              <div key={index} className="project-card">
                <Card className="overflow-hidden h-full flex flex-col">
                  <CardContent className="project-content flex-1 flex flex-col p-5">
                    <h3 className="text-lg font-bold">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 flex-1">{project.description}</p>
                    <div className="project-tags mt-3">
                      {project.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="project-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="project-links mt-4">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={project.codeLink} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-1 h-4 w-4" /> Code
                        </Link>
                      </Button>
                      {project.liveLink && (
                        <Button size="sm" variant="outline" asChild>
                          <Link href={project.liveLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-1 h-4 w-4" /> Live
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
