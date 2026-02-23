import { memo, useState } from 'react';
import { Button } from './Button';
import './ImageUpload.css';

export const ImageUpload = memo(
  ({ value, onChange, error, label = 'Imagem' }) => {
    const [preview, setPreview] = useState(value || null);

    const handleFileChange = e => {
      const file = e.target.files[0];
      if (!file) return;

      // Verificar tipo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem válida');
        return;
      }

      // Verificar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      onChange(file);
    };

    const removeImage = () => {
      setPreview(null);
      onChange(null);
    };

    return (
      <div className="image-upload-container">
        <label className="input-label">{label}</label>

        {!preview ? (
          <>
            <div className="upload-options">
              <div className="upload-option">
                <label
                  htmlFor="file-input"
                  className="file-label"
                >
                  <span>📁 Escolher arquivo</span>
                </label>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="preview-container">
            <img
              src={preview}
              alt="Preview"
              className="image-preview"
            />
            <Button onClick={removeImage} variant="danger">
              Remover Imagem
            </Button>
          </div>
        )}

        {error && (
          <span className="error-message">{error}</span>
        )}
      </div>
    );
  }
);

ImageUpload.displayName = 'ImageUpload';
