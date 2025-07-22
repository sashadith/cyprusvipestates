"use client";

export default function ProjectsGridSkeleton() {
  return (
    <div className="projects">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="project-skeleton-card" />
      ))}
    </div>
  );
}
