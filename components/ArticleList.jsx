import ArticleCard from "./ArticleCard";

export default function ArticleList({ articles = [] }) {
  if (!articles.length) return <p className="muted">No content yet.</p>;
  return (
    <div>
      {articles.map((a) => (
        <ArticleCard key={a.id} article={a} />
      ))}
    </div>
  );
}

