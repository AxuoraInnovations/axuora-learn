interface BlogCardProps {
  title: string;
  date: string;
  description: string;
}

export function BlogCard({ title, date, description }: BlogCardProps) {
  return (
    <div className="w-full min-h-20 p-4 space-y-1 blog-card group hover:cursor-pointer">
      <div className="flex justify-center gap-1 items-end relative">
        <div className="md:text-2xl text-xl font-serif whitespace-nowrap text-neutral-700 group-hover:text-primary transition-all duration-500 ease-out">
          {title}
        </div>
        <span className="w-full border-b-[0.5px] border-dashed border-neutral-400 group-hover:border-primary mb-[6px]" />
        <div className="text-neutral-500 whitespace-nowrap uppercase group-hover:text-primary font-mono md:text-base text-xs transition-all duration-500 ease-out">
          {date}
        </div>
      </div>
      <div className="text-neutral-500 md:text-lg group-hover:text-primary md:max-w-full max-w-sm transition-all duration-500 ease-out">
        {description}
      </div>
    </div>
  );
}
