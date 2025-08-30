const toDMY = (date) => {
    if (!date) return '';
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
};

export const searchDocuments = (auth) => async ({
    majorHead = '',
    minorHead = '',
    fromDate = null,
    toDate = null,
    tags = [],
    start = 0,
    length = 20,
    searchValue = '',
    uploadedBy = '',
    filterId = '',
}) => {
    try {
        const token = auth?.token;
        if (!token) throw new Error('No token provided');

        const payload = {
            start,
            length,
            major_head: majorHead || '',
            minor_head: minorHead || '',
            from_date: fromDate ? toDMY(fromDate) : '',
            to_date: toDate ? toDMY(toDate) : '',
            tags: Array.isArray(tags) && tags.length > 0
                ? tags.map(t => (typeof t === 'string' ? { tag_name: t } : t))
                : [{ tag_name: '' }],
            uploaded_by: uploadedBy || '',
            filterId: filterId || '',
            search: { value: searchValue || '' },
        };

        console.log('searchDocuments payload:', payload);

        const res = await fetch(
            'https://apis.allsoft.co/api/documentManagement/searchDocumentEntry',
            {
                method: 'POST',
                headers: {
                    token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            }
        );

        if (!res.ok) throw new Error(`Search failed: ${res.status}`);

        const data = await res.json();
        console.log('searchDocuments response:', data);

        return data;
    } catch (error) {
        console.error('searchDocuments error:', error);
        throw error;
    }
};
