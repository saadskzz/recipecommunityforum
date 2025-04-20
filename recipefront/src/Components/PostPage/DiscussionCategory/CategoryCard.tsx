import { useGetAllDiscussionsQuery } from "../../../Slices/discussionsApi";
import { BookFilled } from "@ant-design/icons";
import './categorycard.css';

interface CategoryCardProps {
  onCategorySelect?: (categoryId: string) => void;
  selectedCategory?: string | null;
}

const CategoryCard = ({ onCategorySelect, selectedCategory }: CategoryCardProps) => {
  const { data: categories, isLoading, isError } = useGetAllDiscussionsQuery(undefined);

  if (isLoading) return <div>Loading categories...</div>;
  if (isError) return <div>Error loading categories</div>;

  return (
    <div className="category-card">
      <h2>Discussion Categories</h2>
      <div className="categories-list">
        {categories?.map((category: any) => (
          <div
            key={category._id}
            className={`category-item ${selectedCategory === category._id ? 'selected-category' : ''}`}
            onClick={() => onCategorySelect && onCategorySelect(category._id)}
          >
            <BookFilled />
            <span>{category.discussionCategory}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCard;