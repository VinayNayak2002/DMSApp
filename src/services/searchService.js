import { getToken } from './storage';

const toDMY = (date) => {
    if (!date) return '';
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
};

export const searchDocuments = async ({
    majorHead,
    minorHead,
    fromDate,
    toDate,
    tags = [],
    start = 0,
    length = 20,
    searchValue = '',
    uploadedBy = '',
    filterId = '',
}) => {
    const token = await getToken();
    if (!token) throw new Error('No token found');

    const payload = {
        start,
        length,
        search: { value: searchValue },
    };

    if (majorHead) payload.major_head = majorHead;
    if (minorHead) payload.minor_head = minorHead;

    // Include date range only if both are provided
    if (fromDate && toDate) {
        payload.from_date = toDMY(fromDate);
        payload.to_date = toDMY(toDate);
    }

    if (uploadedBy) payload.uploaded_by = uploadedBy;
    if (filterId) payload.filterId = filterId;

    if (Array.isArray(tags) && tags.length > 0) {
        payload.tags = tags.map((t) =>
            typeof t === 'string' ? { tag_name: t } : t
        );
    }

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
    console.log('Search response:', data);
    return data;
};
