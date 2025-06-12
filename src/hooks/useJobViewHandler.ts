
export const useJobViewHandler = () => {
  const handleViewJob = (jobLink: string) => {
    if (!jobLink) {
      return;
    }

    let url = jobLink.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      // Silent fail for security
    }
  };

  return { handleViewJob };
};
