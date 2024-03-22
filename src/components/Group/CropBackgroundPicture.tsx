import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Cropper, CropperRef, ImageRestriction, RectangleStencil } from 'react-advanced-cropper';
import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import { useRootStore } from '@/stores/Root.store';
import { showErrorNotification, showSuccessNotification } from '@/utils/notification';

export const CropBackgroundPicture = observer(() => {
  const store = useRootStore();
  const [image, setImage] = useState<string>(
    'https://images.unsplash.com/photo-1710432157519-e437027d2e8f?q=80&w=3759&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  );
  const { id } = useParams();

  const inputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<CropperRef>(null);
  const [userHasUploaded, setUserHasUploaded] = useState(false);

  const group = store.groupStore.getGroupById(Number(id));

  const onCrop = async () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      if (canvas) {
        canvas.toBlob(
          async (blob) => {
            if (blob) {
              const formData = new FormData();
              formData.append('file', blob, 'image.jpg');
              try {
                await store.api.updateBackground(formData, group.id!);
                store.groupStore.setBackgroundUrl(group, blob);
                await showSuccessNotification('Your avatar has been updated');
              } catch (error) {
                await showErrorNotification(error, 'An error occurred while updating your avatar');
              }
            }
          },
          'image/jpeg',
          0.95
        );
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
            lines: true,
            grid: true,
            movable: true,
            resizable: false,
            aspectRatio: 10 / 5,
          }}
          stencilComponent={RectangleStencil}
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
});

export default CropBackgroundPicture;
