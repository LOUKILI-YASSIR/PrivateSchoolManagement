// Global page configuration
export const pageConfig = {
    currentPage: '',
    setCurrentPage: (page) => {
        pageConfig.currentPage = page.toLowerCase();
    },
    getCurrentPage: () => pageConfig.currentPage,
    
    // Page-specific configurations
    configurations: {
        students: {
            formFields: [
                'PROFILE_PICTUREEt', 'GENREEt', 'NOMEt', 'PRENOMEt', 
                'LIEU_NAISSANCEEt', 'DATE_NAISSANCEEt', 'NATIONALITEEt',
                'ADRESSEEt', 'VILLEEt', 'PAYSEt', 'CODE_POSTALEt',
                'EMAILEt', 'OBSERVATIONEt',
                // Parent Information
                'LIEN_PARENTETr', 'NOMTr', 'PRENOMTr', 'PROFESSIONTr',
                'TELEPHONE1Tr', 'TELEPHONE2Tr', 'EMAILTr', 'OBSERVATIONTr'
            ],
            filterFields: ['NOMEt', 'PRENOMEt', 'GENREEt'],
            exportFields: ['NOMEt', 'PRENOMEt', 'EMAILEt', 'TELEPHONE1Tr'],
            apiEndpoint: '/api/etudiants',
            apiEndpoints: {
                list: '/api/etudiants',
                create: '/api/etudiants',
                update: '/api/etudiants/{id}',
                delete: '/api/etudiants/{id}',
                getById: '/api/etudiants/{id}',
                paginate: '/api/etudiants/paginate',
                count: '/api/etudiants/count'
            }
        },
        teachers: {
            formFields: ['firstName', 'lastName', 'email', 'phone', 'specialization'],
            filterFields: ['firstName', 'lastName', 'specialization'],
            exportFields: ['firstName', 'lastName', 'email', 'specialization'],
            apiEndpoint: '/api/professeurs',
            apiEndpoints: {
                list: '/api/professeurs',
                create: '/api/professeurs',
                update: '/api/professeurs/{id}',
                delete: '/api/professeurs/{id}',
                getById: '/api/professeurs/{id}',
                paginate: '/api/professeurs/paginate',
                count: '/api/professeurs/count'
            }
        },
        enrollments: {
            formFields: ['studentId', 'level', 'academicYear', 'section'],
            filterFields: ['studentName', 'level', 'academicYear'],
            exportFields: ['studentName', 'level', 'academicYear', 'section'],
            apiEndpoint: '/api/inscriptions',
            apiEndpoints: {
                list: '/api/inscriptions',
                create: '/api/inscriptions',
                update: '/api/inscriptions/{id}',
                delete: '/api/inscriptions/{id}',
                getById: '/api/inscriptions/{id}',
                paginate: '/api/inscriptions/paginate',
                count: '/api/inscriptions/count'
            }
        },
        subjects: {
            formFields: ['name', 'code', 'description'],
            filterFields: ['name', 'code'],
            exportFields: ['name', 'code', 'description'],
            apiEndpoint: '/api/matieres',
            apiEndpoints: {
                list: '/api/matieres',
                create: '/api/matieres',
                update: '/api/matieres/{id}',
                delete: '/api/matieres/{id}',
                getById: '/api/matieres/{id}',
                paginate: '/api/matieres/paginate',
                count: '/api/matieres/count'
            }
        }
    }
};

// Helper function to get page configuration
export const getPageConfig = (page) => {
    const pageKey = page.toLowerCase();
    return pageConfig.configurations[pageKey] || {};
};

// Helper function to get API endpoint with pagination
export const getPaginatedEndpoint = (endpoint, page = 0, limit = 10) => {
    return `${endpoint}/paginate?page=${page}&limit=${limit}`;
};

// Helper function to replace URL parameters
export const replaceUrlParams = (url, params) => {
    let result = url;
    Object.keys(params).forEach(key => {
        result = result.replace(`{${key}}`, params[key]);
    });
    return result;
}; 