
export const transformFormData = (data, tableName) => {
  const mapping = {
    etudiants: ['Et', 'Tr',"Ut","Gp","Nv"],
    professeurs: ['Pr',"Ut","Mt"],
    matieres: ['Mt'],
    groupes: ['Gp'],
    niveaux: ['Nv'],
    salles: ['Sl'],
    timeSlots: ['Ts'],
    dayWeeks: ['Dw'],
    regularTimeTables: ['Rt'],
  };

  return Object.entries(data).reduce((acc, [key, value]) => {
    const match = key.match(/_(\d+)$/);
    const index = match ? parseInt(match[1], 10) - 1 : 0;
    const cleanKey = key.replace(/(_\d+)$/, '');
    const suffix = mapping[tableName]?.[index] || '';
    acc[`${cleanKey}${suffix}`] = String(value ?? '');
    return acc;
  }, {});
};

export const transformResponseToFormData = (response, tableName) => {
  if (!response) return {};

  const defaultState = getDefaultState()[tableName.toUpperCase()];
  return Object.entries(response).reduce((acc, [key, value]) => {
    if (key in defaultState) {
      acc[key] = (value === "null" || !value) ? '' : value;
    }
    return acc;
  }, {});
};

