import { TagsSelector } from "@/components/integrations/21st/tags-selector.component";

const TAGS = [
  { id: "docker", label: "Docker" },
  { id: "kubernetes", label: "Kubernetes" },
  { id: "aws", label: "AWS" },
  { id: "graphql", label: "GraphQL" },
  { id: "mongodb", label: "MongoDB" },
  { id: "postgresql", label: "PostgreSQL" },
  { id: "redis", label: "Redis" },
  { id: "git", label: "Git" },
];

const TagsSelectorDemo = () => (
  <div style={{ padding: "20px", maxWidth: "600px", width: "100%" }}>
    <TagsSelector tags={TAGS} />
  </div>
);

export { TagsSelectorDemo };
export default TagsSelectorDemo;


