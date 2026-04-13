import { useContentStore } from "@/store/contentStore";
import { getTagColor } from "@/lib/colors";
import { useMemo } from "react";

const TagList = () => {
  const { items, activeTags, toggleTag } = useContentStore();

  const allTags = useMemo(() => {
    const set = new Set<string>();
    items.forEach(i => i.tags.forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, [items]);

  return (
    <div className="flex flex-wrap gap-1.5">
      {allTags.map(tag => (
        <button
          key={tag}
          onClick={() => toggleTag(tag)}
          className={`text-xs px-2 py-1 rounded-full transition-all ${
            activeTags.includes(tag)
              ? "bg-primary text-primary-foreground ring-2 ring-primary/50"
              : getTagColor(tag) + " hover:opacity-80"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagList;
