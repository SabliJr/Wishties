import React, {
  useState,
  useRef,
  ChangeEvent,
  useEffect,
  useCallback,
  useContext,
} from "react";
import "./upLoadWish.css";

import WishUploadImg from "../../Assets/WishImg.png";
import { GlobalValuesContext } from "../../Context/globalValuesContextProvider";
import { iGlobalValues } from "../../Types/creatorSocialLinksTypes";

import { iWishInfo } from "../../Types/wishListTypes";
import { MdClose } from "react-icons/md";

import { onAddWish } from "../../API/authApi";
import Loader from "../../Loader";
import CurrencyInput, { formatValue } from "react-currency-input-field";

import FormatMoney from "../../utils/FormatMoney";
const ALLOWED_EXTENSIONS = /(\.jpg|\.jpeg|\.png|\.webp)$/i;
interface iProps {
  uploadModule: boolean;
  closeUploadModule: () => void;
  modalOpen: boolean;
}

const Index = ({ uploadModule, closeUploadModule, modalOpen }: iProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [wishImg, setWishImg] = useState<File | undefined>();
  const [isError, setIsError] = useState({
    invalidFileTypeErr: "",
    emptyFieldsErr: "",
  });
  const [wishInputs, setWishInputs] = useState<iWishInfo>({} as iWishInfo);
  const ImgInputRef = useRef<HTMLInputElement>(null);
  const modelRef = useRef<HTMLDivElement | null>(null);
  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { setRefresh } = contextValues as iGlobalValues;

  const handleImgUpload = () => {
    ImgInputRef?.current?.click();
  };

  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const imgFile: File | undefined = e.target?.files?.[0];
    setWishImg(imgFile);

    setWishInputs({ ...wishInputs, wish_image: imgFile });
  };

  // This function is to close the module of adding wish when the user clicks outside the module
  const closeModuleOutside = useCallback(
    (e: MouseEvent) => {
      if (modelRef?.current && !modelRef?.current?.contains(e.target as Node)) {
        closeUploadModule();
      }
    },
    [closeUploadModule]
  );

  useEffect(() => {
    document.addEventListener("mouseup", closeModuleOutside);
    return () => {
      document.removeEventListener("mouseup", closeModuleOutside);
    };
  }, [closeModuleOutside]);

  useEffect(() => {
    // Add the 'modal-open' class to the body when the modal is open
    if (modalOpen && !modelRef?.current?.contains(document.activeElement)) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    // Clean up function
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [modalOpen]);

  //This function is to grape the user's inputs from the fields
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    let value = e.target.value;
    // if (field === "wish_price" && value !== "") {
    //   value = new Intl.NumberFormat("en-US", {
    //     style: "currency",
    //     currency: "USD",
    //   }).format(Number(value));
    //   console.log(value);
    // }
    setWishInputs({ ...wishInputs, [field]: value });
  };

  const addTheWish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset error state
    setIsError({
      invalidFileTypeErr: "",
      emptyFieldsErr: "",
    });

    const formData = new FormData();
    if (
      !wishInputs.wish_name ||
      !wishInputs.wish_price ||
      !wishInputs.wish_image
    ) {
      setIsError((prev) => ({
        ...prev,
        emptyFieldsErr: "Please fill in all your wish details.",
      }));

      return;
    }

    if (
      wishInputs.wish_image &&
      !ALLOWED_EXTENSIONS.exec(wishInputs.wish_image.name)
    ) {
      setIsError((prev) => ({
        ...prev,
        invalidFileTypeErr:
          "Please upload file having extensions .jpeg/.jpg/.png/.webp only.",
      }));

      return;
    }

    formData.append("wish_name", wishInputs.wish_name);
    formData.append("wish_price", wishInputs.wish_price);
    formData.append("wish_category", wishInputs.wish_category);
    if (wishInputs.wish_image) {
      formData.append("wish_image", wishInputs.wish_image);
    }

    // Set isUploading to true only after all validations have passed
    setIsUploading(true);

    try {
      await onAddWish(formData);
      setRefresh(true);
    } catch (error: any) {
      console.log(error);
      // Set an error state here to inform the user about the error
      setIsError((prev) => ({
        ...prev,
        serverError: error.message,
      }));
    } finally {
      if (uploadModule === true) {
        closeUploadModule();
      }
      setIsUploading(false);
    }
  };

 return (
   <>
     <div className='dropBack'></div>
     {isUploading && !Object.values(isError).some((value) => value !== "") && (
       <Loader />
     )}
     <main className='wishUploaderSection' ref={modelRef}>
       <MdClose className='editProfileClose' onClick={closeUploadModule} />
       <form onSubmit={(e) => addTheWish(e)}>
         <h3 className='wishInfoTitle'>Wish Information.</h3>
         <div className='wishInfoInputsDiv'>
           <label htmlFor='wishName'>
             Name
             <input
               type='text'
               placeholder='Your wish name'
               // autoComplete='off'
               // value={wishInputs.wish_name ? wishInputs.wish_name : ""}
               id='wishName'
               onChange={(e) => {
                 handleInputChange(e, "wish_name");
                 setIsError((prev) => ({ ...prev, emptyFieldsErr: "" }));
               }}
             />
           </label>
           <label htmlFor='thePrice'>
             Price
             <input
               type='text'
               placeholder='Enter Amount $:'
               // autoComplete='off'
               value={wishInputs.wish_price ? wishInputs.wish_price : ""}
               id='thePrice'
               onChange={(e) => {
                 handleInputChange(e, "wish_price");
                 setIsError((prev) => ({ ...prev, emptyFieldsErr: "" }));
               }}
             />
           </label>
         </div>
         <div className='imgUploaderDiv' onClick={handleImgUpload}>
           {wishImg ? (
             <img
               src={URL.createObjectURL(wishImg)}
               alt='wishUploadImg'
               className='wishUploadImg'
             />
           ) : (
             <img
               src={WishUploadImg}
               alt='wishUploadImg'
               className='wishUploadImg'
             />
           )}

           <p className='UploadAnImage'>Upload an image.</p>
           <input
             type='file'
             id='image_uploads'
             name='image_uploads'
             accept='.jpg, .jpeg, .png, .webp'
             ref={ImgInputRef}
             style={{ display: "none" }}
             onChange={handleImgChange}
           />
         </div>
         {isError.invalidFileTypeErr && (
           <p className='error'>{isError.invalidFileTypeErr}</p>
         )}
         <div className='categoriesDiv'>
           <h4>
             Publish <span>(optional)</span>{" "}
           </h4>
           <p>
             Categorize your wishes to help gifters find what they're looking
             for on your wishlist.
           </p>
           <div>
             <input
               type='text'
               placeholder='Add a category'
               value={wishInputs.wish_category || ""}
               onChange={(e) => {
                 handleInputChange(e, "wish_category");
                 setIsError((prev) => ({ ...prev, emptyFieldsErr: "" }));
               }}
             />
           </div>
         </div>
         {isError.emptyFieldsErr && (
           <p className='errorMsg'>{isError.emptyFieldsErr}</p>
         )}
         <button className='addWishBtn' disabled={isUploading}>
           Add The Wish
         </button>
       </form>
     </main>
   </>
 );
};

export default Index;
