import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { CircleStencil, Cropper, CropperRef, ImageRestriction } from 'react-advanced-cropper';
import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';

export const CropProfilePicture = () => {
  const [image, setImage] = useState<string>(
    'https://images.unsplash.com/photo-1710432157519-e437027d2e8f?q=80&w=3759&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<CropperRef>(null);
  const [userHasUploaded, setUserHasUploaded] = useState(false);

  const onCrop = () => {
    console.log(image);
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      const newTab = window.open();
      if (newTab && canvas) {
        newTab.document.body.innerHTML = `<img src="${canvas.toDataURL()}"></img>`;
      }
    }
  };
  const openModal = () =>
    modals.openConfirmModal({
      title: 'Please confirm your action',
      size: 'xl',
      centered: true,
      children: image && (
        <Cropper
          ref={cropperRef}
          style={{ backgroundColor: 'transparent' }}
          src={image}
          stencilProps={{
            handlers: false,
            lines: false,
            movable: false,
            resizable: false,
          }}
          stencilComponent={CircleStencil}
          imageRestriction={ImageRestriction.stencil}
        />
      ),
      labels: {
        confirm: 'Download result',
        cancel: 'Cancel',
      },
      onConfirm: onCrop,
    });

  const onUpload = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onLoadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setImage(objectURL);
      setUserHasUploaded(true);
    }
    // event.target.value = '';
  };

  useEffect(() => {
    if (image && userHasUploaded) {
      openModal();
    }
  }, [image]);

  return (
    <div className="example">
      <div className="example__buttons-wrapper">
        <Button onClick={onUpload}>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onLoadImage}
            style={{ display: 'none' }}
          />
          Upload image (png, jpg)
        </Button>
      </div>
    </div>
  );
};

export default CropProfilePicture;
