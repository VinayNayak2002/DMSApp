const formatDate = (date) => {
    if (!date) return '';
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
};

export const uploadDocument = (auth) => async ({
    documentDate,
    majorHead,
    minorHead,
    selectedTags = [],
    remarks = '',
    file,
}) => {
    try {
        const token = auth?.token;
        const userId = auth?.userId || ''; 

        if (!token) throw new Error('No authentication token found');

        if (!file) throw new Error('No file selected for upload');

        const formData = new FormData();

        formData.append('file', {
            uri: file.uri,
            type: file.type || 'application/octet-stream',
            name: file.fileName || 'upload',
        });

        const dataPayload = {
            major_head: majorHead || '',
            minor_head: minorHead || '',
            document_date: formatDate(documentDate),
            document_remarks: remarks,
            tags: selectedTags.map(tag => ({ tag_name: tag })),
            user_id: userId,
        };

        formData.append('data', JSON.stringify(dataPayload));

        const response = await fetch(
            'https://apis.allsoft.co/api/documentManagement/saveDocumentEntry',
            {
                method: 'POST',
                headers: { token },
                body: formData,
            }
        );

        if (!response.ok) throw new Error(`Upload failed: ${response.status}`);

        const result = await response.json();
        console.log('Upload response:', result);

        return result;
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
};
