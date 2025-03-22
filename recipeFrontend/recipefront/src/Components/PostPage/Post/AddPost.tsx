import React, { useState, useCallback } from 'react';
import CustomInput from '../../CustomInput';
import '../Post/addpost.css';
import { Input, message } from 'antd';
import { useCreatePostMutation } from '../../../Slices/postSlice';
import { useGetAllDiscussionsQuery } from '../../../Slices/discussionsApi';
import CustomButton from '../../CustomButton';
import { useDropzone } from 'react-dropzone';
import Upload from '../../../../upload2.svg'
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

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles[0]) {
            setRecipeimg(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
        <div className='post-modal-content'>
            <p>Title</p>
            <CustomInput
                placeholder="Title"
                value={title}
                name="title"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            />
            <p>Ingredients</p>
            <CustomInput
                placeholder="Ingredients"
                value={ingredients.join(', ')}
                name="ingredients"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIngredients(e.target.value.split(', '))}
            />
           <p>Description</p>
            <TextArea
                rows={4}
                value={instructions}
                name="instructions"
                placeholder="add instructions"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInstructions(e.target.value)}
               
            />
            <p style={{marginTop:20}}>Choose Category</p>
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
            <p style={{marginTop:20}}>Image(Optional)</p>
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the files here ...</p>
                ) : (
                    <div>
                        <img src={Upload} alt="upliad" />
                    <p>Browse Files Here</p>
                    <label htmlFor="recipeimg" className="custom-file-label">
                    Browse 
                </label>
                    </div>
                )}
            </div>
            {recipeimg && (
                <div className="image-preview">
                    <img src={URL.createObjectURL(recipeimg)} alt="Recipe Preview" />
                </div>
            )}
            <div>
                
                <input
                    type="file"
                    id="recipeimg"
                    name="recipeimg"
                    onChange={handleImageUpload}
                    className='custom-file-upload'
                />
            </div>

         
            <div style={{display:'flex',justifyContent:'space-between'}}>
               
                <CustomButton btnTxt="Cancel" backgroundColor="#EFE1FF" color="#773CBD" margin="0px 0px 0px 10px" />
               
            <CustomButton btnTxt="submit" onClick={handleCreateFood} backgroundColor="#6521B5" color="#FFFFFF" margin="0 0 0 10px" />
            {successMessage && <p>{successMessage}</p>}
            </div>
        </div>
    );
}

export default AddPost;