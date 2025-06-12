
export const useJobViewHandler = () => {
  const handleViewJob = (jobLink: string) => {
    if (!jobLink) {
      console.error('No job link provided');
      return;
    }

    let url = jobLink.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error opening job link:', error);
    }
  };

  return { handleViewJob };
};
