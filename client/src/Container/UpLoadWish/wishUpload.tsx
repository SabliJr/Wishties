import React, { useState, useRef, ChangeEvent } from "react";

interface iCropped {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ImageCropper = () => {
  const [image, setImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<null | string>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cropRect = useRef<iCropped>({ x: 0, y: 0, width: 0, height: 0 });

  const onImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result as string | null);
      setCroppedImage(null);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    if (image) {
      const img = new Image();
      img.src = image;

      img.onload = () => {
        const canvas = canvasRef?.current;
        if (canvas) {
          const ctx = canvas?.getContext("2d");

          canvas.width = cropRect.current.width;
          canvas.height = cropRect.current.height;
          ctx?.drawImage(
            img,
            cropRect.current.x,
            cropRect.current.y,
            cropRect.current.width,
            cropRect.current.height,
            0,
            0,
            cropRect.current.width,
            cropRect.current.height
          );

          // const context = canvasRef.current?.getContext("2d");
          const croppedDataURL = canvas.toDataURL("image/jpeg"); // You can specify the desired image format
          setCroppedImage(croppedDataURL);
        }
      };
    }
  };

  const handleCropAreaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    cropRect.current = { ...cropRect.current, [name]: parseInt(value, 10) };
  };

  return (
    <div>
      <input type='file' accept='image/*' onChange={onImageUpload} />
      {image && (
        <div>
          <div>
            <label>
              X:
              <input type='number' name='x' onChange={handleCropAreaChange} />
            </label>
            <label>
              Y:
              <input type='number' name='y' onChange={handleCropAreaChange} />
            </label>
            <label>
              Width:
              <input
                type='number'
                name='width'
                onChange={handleCropAreaChange}
              />
            </label>
            <label>
              Height:
              <input
                type='number'
                name='height'
                onChange={handleCropAreaChange}
              />
            </label>
            <button onClick={handleCrop}>Crop</button>
          </div>
          <canvas ref={canvasRef}></canvas>
          {croppedImage && <img src={croppedImage} alt='Cropped' />}
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
