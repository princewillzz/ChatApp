import React from 'react';
import {Modal, StyleSheet} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

export default function ImageModal({
  images,
  showImageModal,
  handleOpenImageModal,
  handleCloseImageModal,
}) {
  // const [showImageModal, setShowImageModal] = useState(false);

  // const handleCloseImageModal = () => setShowImageModal(false);
  // const handleOpenImageModal = () => setShowImageModal(true);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showImageModal}
      onRequestClose={handleCloseImageModal}>
      <ImageViewer
        imageUrls={[{url: images?.uri}]}
        enableImageZoom
        enableSwipeDown
        onSwipeDown={handleCloseImageModal}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({});
