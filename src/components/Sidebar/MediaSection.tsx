import { useRef, useCallback, memo, type ReactNode } from 'react';
import { motion } from 'motion/react';
import type { AppState, AppActions } from '../../types';
import { Section, IconButton } from '../ui';
import styles from './MediaSection.module.css';

interface MediaSectionProps {
  state: AppState;
  actions: AppActions;
}

export const MediaSection = memo(function MediaSection({ state, actions }: MediaSectionProps): ReactNode {
  const { bgColor } = state;
  const { setBgColor, handleImagesUpload, handleBgUpload, resetBg } = actions;

  const imgInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const onImagesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      handleImagesUpload(e.target.files);
      // Reset so the same file(s) can be re-selected
      e.target.value = '';
    }
  }, [handleImagesUpload]);

  const onBgChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files?.[0]) {
      handleBgUpload(e.target.files[0]);
    }
  }, [handleBgUpload]);

  return (
    <Section icon="image" title="Photos" step={1}>
      <div className={styles.content}>
        {/* Upload photos button */}
        <motion.button
          onClick={() => imgInputRef.current?.click()}
          className={styles.uploadBtn}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className={`material-symbols-rounded ${styles.uploadIcon}`}>add_photo_alternate</span>
          <span className={styles.uploadText}>Add Photos</span>
        </motion.button>

        {/* Background controls */}
        <div className={styles.bgGroup}>
          <label className={styles.bgLabel}>
            <span className="material-symbols-rounded" style={{ fontSize: 14 }}>wallpaper</span>
            Background
          </label>
          <div className={styles.bgControls}>
            <div className={styles.colorPickerWrapper}>
              <span className={styles.colorText}>Color</span>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className={styles.colorInput}
              />
            </div>
            <IconButton
              icon="photo_library"
              title="Upload Image"
              onClick={() => bgInputRef.current?.click()}
            />
            <IconButton
              icon="delete"
              variant="danger"
              title="Reset Background"
              onClick={resetBg}
            />
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={imgInputRef}
        className={styles.hidden}
        multiple
        accept="image/png, image/jpeg"
        onChange={onImagesChange}
      />
      <input
        type="file"
        ref={bgInputRef}
        className={styles.hidden}
        accept="image/png, image/jpeg"
        onChange={onBgChange}
      />
    </Section>
  );
});
