import React, { useState } from 'react';
import CustomInput from '../../CustomInput';
import '../Post/addpost.css';
import { Input, message } from 'antd';
import { useCreatePostMutation } from '../../../Slices/postSlice';
import { useGetAllDiscussionsQuery } from '../../../Slices/discussionsApi';
import CustomButton from '../../CustomButton';

interface Categoryfields {
    _id: string;
  discussionCategory:string
}

const { TextArea } = Input;

function AddPost() {
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [instructions, setInstructions] = useState('');
    const [recipeimg, setRecipeimg] = useState<File | null>(null);
    const [selectedDiscussionCategory, setSelectedDiscussionCategory] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState('');

    const { data: categories = [], error, isLoading } = useGetAllDiscussionsQuery(undefined);
    const [createPost] = useCreatePostMutation();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setRecipeimg(e.target.files[0]);
        }
    };
    console.log(title,'titile',ingredients,'ing','instructions',instructions,recipeimg,'recipe',selectedCategory,selectedDiscussionCategory)

    const handleCreateFood = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('ingredients', ingredients.join(', '));
        formData.append('instructions', instructions); // Ensure this line is correct
        formData.append('discussionCategory', selectedDiscussionCategory);
        if (recipeimg) {
            formData.append('recipeimg', recipeimg, 'recipeimg.jpg');
        }
        try {
            const response = await createPost( formData );
            console.log('Response:', response);
            setSuccessMessage('Post created successfully');
            message.success('Post created successfully');
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const handleCategoryClick = (categoryId: string) => {
        setSelectedCategory(categoryId);
        setSelectedDiscussionCategory(categoryId);
        console.log(selectedDiscussionCategory);
    };

    return (
        <div>
            <CustomInput
                placeholder="Title"
                value={title}
                name="title"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            />
            <CustomInput
                placeholder="Ingredients"
                value={ingredients.join(', ')}
                name="ingredients"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIngredients(e.target.value.split(', '))}
            />
            <TextArea
                rows={4}
                value={instructions}
                name="instructions"
                placeholder="add instructions"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInstructions(e.target.value)}
               
            />
            <div>            <label htmlFor="recipeimg" className="custom-file-label">
    Browse Picture
  </label>
            <input
                type="file"
                id="recipeimg"
                name="recipeimg"
                onChange={handleImageUpload}
                className='custom-file-upload'
            />
            </div>

            <div className="categorystyle">
                {categories.map((category: Categoryfields) => (
                    <div
                        key={category._id}
                        onClick={() => handleCategoryClick(category._id)}
                        style={{ color: selectedCategory === category._id ? '#6521B5' : '#696F77' }}
                    >
                        <p>{category.discussionCategory}</p>
                    </div>
                ))}
            </div>
            
            <CustomButton btnTxt="submit" onClick={handleCreateFood} />
            {successMessage && <p>{successMessage}</p>}
        </div>
    );
}

export default AddPost;