// ==================== UI Helper Functions ====================

const UI = {
    // Mostrar toast notification
    showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        
        toast.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <div class="toast-message">${message}</div>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Mostrar modal
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    },

    // Ocultar modal
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    },

    // Renderizar tabla
    renderTable(section, data) {
        const config = SectionConfig[section];
        const tableContainer = document.getElementById('dataTable');
        
        if (!data || data.length === 0) {
            tableContainer.innerHTML = `
                <div class="loading">
                    <i class="fas fa-inbox"></i>
                    <p>No hay datos para mostrar</p>
                </div>
            `;
            return;
        }

        let html = '<table class="table"><thead><tr>';
        
        // Headers
        config.tableColumns.forEach(col => {
            html += `<th>${col.label}</th>`;
        });
        html += '</tr></thead><tbody>';
        
        // Rows
        data.forEach(item => {
            html += '<tr>';
            config.tableColumns.forEach(col => {
                html += '<td>';
                html += this.renderCell(col, item, section);
                html += '</td>';
            });
            html += '</tr>';
        });
        
        html += '</tbody></table>';
        tableContainer.innerHTML = html;
    },

    // Renderizar celda según tipo
    renderCell(column, item, section) {
        const value = item[column.key];
        const config = SectionConfig[section];
        
        switch (column.type) {
            case 'status':
                return value == 1 
                    ? '<span class="status-badge status-active">Activo</span>'
                    : '<span class="status-badge status-inactive">Inactivo</span>';
            
            case 'boolean':
                return value 
                    ? '<i class="fas fa-check-circle" style="color: var(--success);"></i>'
                    : '<i class="fas fa-times-circle" style="color: var(--gray);"></i>';
            
            case 'image':
                return value 
                    ? `<img src="${value}" alt="Preview" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px;">`
                    : '<i class="fas fa-image" style="color: var(--gray);"></i>';
            
            case 'badge':
                const badges = {
                    admin: '<span class="status-badge status-active">Admin</span>',
                    editor: '<span class="status-badge" style="background: #dbeafe; color: #1e40af;">Editor</span>',
                    viewer: '<span class="status-badge" style="background: #e5e7eb; color: #374151;">Viewer</span>'
                };
                return badges[value] || value;
            
            case 'actions':
                const id = item[config.idField];
                let buttons = '';
                
                // Botón de imágenes si aplica
                if (config.supportsImages) {
                    buttons += `
                        <button class="btn btn-info btn-sm" onclick="UI.openImageManager('${section}', ${id}, '${item.nombre || id}')">
                            <i class="fas fa-images"></i>
                        </button>
                    `;
                }
                
                // Botón editar
                if (canEdit()) {
                    buttons += `
                        <button class="btn btn-warning btn-sm" onclick="editItem('${section}', ${id})">
                            <i class="fas fa-edit"></i>
                        </button>
                    `;
                }
                
                // Botón eliminar (solo admin)
                if (isAdmin()) {
                    buttons += `
                        <button class="btn btn-danger btn-sm" onclick="deleteItem('${section}', ${id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                }
                
                return `<div class="table-actions">${buttons}</div>`;
            
            default:
                return value || '-';
        }
    },

    // Renderizar formulario
    renderForm(section, item = null) {
        const config = SectionConfig[section];
        const formFields = document.getElementById('formFields');
        let html = '';
        
        config.fields.forEach(field => {
            // Ocultar password en edición
            if (field.hideOnEdit && item) return;
            
            const value = item ? (item[field.name] ?? field.default ?? '') : (field.default ?? '');
            const required = field.required ? 'required' : '';
            
            html += '<div class="form-group">';
            html += `<label for="field_${field.name}">${field.label}${field.required ? ' *' : ''}</label>`;
            
            switch (field.type) {
                case 'textarea':
                    html += `<textarea id="field_${field.name}" name="${field.name}" ${required}>${value}</textarea>`;
                    break;
                
                case 'select':
                    html += `<select id="field_${field.name}" name="${field.name}" ${required}>`;
                    html += '<option value="">Seleccionar...</option>';
                    
                    if (field.options) {
                        field.options.forEach(opt => {
                            const selected = value == opt.value ? 'selected' : '';
                            html += `<option value="${opt.value}" ${selected}>${opt.label}</option>`;
                        });
                    } else if (field.source) {
                        html += `</select>`;
                        // Cargar opciones dinámicamente
                        this.loadSelectOptions(field.source, `field_${field.name}`, value);
                    }
                    
                    html += '</select>';
                    break;
                
                case 'checkbox':
                    const checked = value ? 'checked' : '';
                    html += `<input type="checkbox" id="field_${field.name}" name="${field.name}" ${checked}>`;
                    break;
                
                default:
                    const type = field.type || 'text';
                    const step = field.step ? `step="${field.step}"` : '';
                    const placeholder = field.placeholder ? `placeholder="${field.placeholder}"` : '';
                    html += `<input type="${type}" id="field_${field.name}" name="${field.name}" value="${value}" ${required} ${step} ${placeholder}>`;
            }
            
            html += '</div>';
        });
        
        formFields.innerHTML = html;
    },

    // Cargar opciones de select dinámicamente
    async loadSelectOptions(source, selectId, selectedValue = '') {
        try {
            const response = await api.getAll(source, { activo: 1, limit: 100 });
            const select = document.getElementById(selectId);
            if (!select) return;
            
            const config = SectionConfig[source];
            const dataKey = Object.keys(response.data)[0]; // destinos, subdestinos, etc.
            const items = response.data[dataKey] || [];
            
            items.forEach(item => {
                const option = document.createElement('option');
                option.value = item[config.idField];
                option.textContent = item.nombre || item.username || item[config.idField];
                if (item[config.idField] == selectedValue) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading select options:', error);
        }
    },

    // Abrir gestor de imágenes
    openImageManager(section, entityId, entityName) {
        const config = SectionConfig[section];
        AppState.currentEntity = {
            type: config.imageEntity,
            id: entityId,
            name: entityName
        };
        
        document.getElementById('imageModalTitle').textContent = 
            `Imágenes de: ${entityName}`;
        
        this.loadEntityImages();
        this.showModal('imageModal');
    },

    // Cargar imágenes de una entidad
    async loadEntityImages() {
        const container = document.getElementById('currentImagesList');
        container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><p>Cargando imágenes...</p></div>';
        
        try {
            const response = await api.getImages(
                AppState.currentEntity.type,
                AppState.currentEntity.id
            );
            
            const images = response.data.imagenes || [];
            
            if (images.length === 0) {
                container.innerHTML = `
                    <div class="loading">
                        <i class="fas fa-image"></i>
                        <p>No hay imágenes. Agrega la primera imagen arriba.</p>
                    </div>
                `;
                return;
            }
            
            let html = '';
            images.forEach(img => {
                html += `
                    <div class="image-card">
                        <img src="${img.url}" alt="${img.alt_text || 'Imagen'}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22150%22><rect fill=%22%23ddd%22 width=%22200%22 height=%22150%22/><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23999%22>Error</text></svg>'">
                        <div class="image-card-body">
                            ${img.es_principal ? '<div class="image-card-badge">Principal</div>' : ''}
                            <div class="image-card-info">
                                <div>Orden: ${img.orden}</div>
                                ${img.alt_text ? `<div>${img.alt_text}</div>` : ''}
                            </div>
                            <div class="image-card-actions">
                                ${!img.es_principal ? `
                                    <button class="btn btn-primary btn-sm" onclick="UI.setMainImage(${img.id_imagen})" title="Marcar como principal">
                                        <i class="fas fa-star"></i>
                                    </button>
                                ` : ''}
                                <button class="btn btn-danger btn-sm" onclick="UI.deleteImage(${img.id_imagen})" title="Eliminar">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            container.innerHTML = html;
        } catch (error) {
            container.innerHTML = `
                <div class="loading">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Error al cargar imágenes: ${error.message}</p>
                </div>
            `;
        }
    },

    // Marcar imagen como principal
    async setMainImage(imageId) {
        try {
            await api.updateImage(imageId, { es_principal: true });
            this.showToast('Imagen marcada como principal', 'success');
            this.loadEntityImages();
        } catch (error) {
            this.showToast('Error al actualizar imagen: ' + error.message, 'error');
        }
    },

    // Eliminar imagen
    async deleteImage(imageId) {
        if (!confirm('¿Estás seguro de eliminar esta imagen?')) return;
        
        try {
            await api.deleteImage(imageId);
            this.showToast('Imagen eliminada exitosamente', 'success');
            this.loadEntityImages();
        } catch (error) {
            this.showToast('Error al eliminar imagen: ' + error.message, 'error');
        }
    },

    // Preview de imagen al escribir URL
    setupImagePreview() {
        const urlInput = document.getElementById('imageUrl');
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        
        if (!urlInput) return;
        
        urlInput.addEventListener('input', (e) => {
            const url = e.target.value.trim();
            if (url && url.startsWith('http')) {
                previewImg.src = url;
                preview.style.display = 'block';
            } else {
                preview.style.display = 'none';
            }
        });
    }
};
