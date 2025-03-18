// CategoryCard.tsx
import { useGetAllDiscussionsQuery } from "../../../Slices/discussionsApi";
import { BookFilled } from "@ant-design/icons";
import './categorycard.css'
const CategoryCard = () => {
  const { data: categories, isLoading, isError } = useGetAllDiscussionsQuery(undefined);

  if (isLoading) return <div>Loading categories...</div>;
  if (isError) return <div>Error loading categories</div>;

  return (
    <div className="category-card">
      <h2>Discussion Categories</h2>
      <div className="categories-list">
        {categories?.map((category: any) => (
          <div key={category._id} className="category-item">
            <BookFilled />
            <span>{category.discussionCategory}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCard;