
export const generateSamplePDFContent = (expertData: any, portfolioData: any) => {
  // This function would generate PDF content for the portfolio
  // For now, it's just a placeholder
  return `
    # ${expertData?.title || 'Expert Profile'}
    ## ${expertData?.first_name || ''} ${expertData?.last_name || ''}

    ### About
    ${expertData?.bio || 'No bio provided'}

    ### Experience
    ${portfolioData?.experience?.map((exp: any) => 
      `- ${exp.position} at ${exp.company} (${exp.duration})\n  ${exp.description}`
    ).join('\n\n') || 'No experience data'}

    ### Education
    ${portfolioData?.education?.map((edu: any) => 
      `- ${edu.degree} - ${edu.institution} (${edu.year})`
    ).join('\n') || 'No education data'}

    ### Skills
    ${portfolioData?.skills?.map((skill: any) => 
      `- ${skill.name}: ${skill.level}/5`
    ).join('\n') || 'No skills data'}

    ### Achievements
    ${portfolioData?.achievements?.map((achievement: string) => 
      `- ${achievement}`
    ).join('\n') || 'No achievements data'}
  `;
};

export const getTemplateColors = (templateId: string) => {
  switch (templateId) {
    case "modern":
      return {
        primary: "#3b82f6", // blue-500
        secondary: "#1e40af", // blue-800
        accent: "#dbeafe", // blue-100
        text: "#1e293b", // slate-800
      };
    case "creative":
      return {
        primary: "#a855f7", // purple-500
        secondary: "#ec4899", // pink-500
        accent: "#f3e8ff", // purple-100
        text: "#581c87", // purple-900
      };
    case "minimal":
      return {
        primary: "#1f2937", // gray-800
        secondary: "#4b5563", // gray-600
        accent: "#f3f4f6", // gray-100
        text: "#111827", // gray-900
      };
    case "classic":
    default:
      return {
        primary: "#78350f", // amber-900
        secondary: "#92400e", // amber-800
        accent: "#fffbeb", // amber-50
        text: "#78350f", // amber-900
      };
  }
};
