import { useEffect, useState } from 'react';
import { API } from '../data/siteContent';

function useSiteData() {
  const [roles, setRoles] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [resources, setResources] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          fetch(`${API}/roles`).then((response) =>
            response.ok ? response.json() : []
          ),
          fetch(`${API}/companies`).then((response) =>
            response.ok ? response.json() : []
          ),
          fetch(`${API}/resources`).then((response) =>
            response.ok ? response.json() : []
          ),
          fetch(`${API}/applications`).then((response) =>
            response.ok ? response.json() : []
          )
        ]);

        const [rolesData, companiesData, resourcesData, applicationsData] = results.map((result) =>
          result.status === 'fulfilled' && Array.isArray(result.value) ? result.value : []
        );

        setRoles(rolesData);
        setCompanies(companiesData);
        setResources(resourcesData);
        setApplications(applicationsData);
        setError('');
      } catch (fetchError) {
        setError(fetchError.message || 'Unable to load content.');
      } finally {
        setLoading(false);
      }
    };

    const handleApplicationCreated = (event) => {
      const application = event.detail;

      if (!application) {
        return;
      }

      setApplications((prev) => {
        const alreadyExists = prev.some((item) => item._id && item._id === application._id);
        return alreadyExists ? prev : [application, ...prev];
      });
    };

    fetchData();
    window.addEventListener('application:created', handleApplicationCreated);

    return () => {
      window.removeEventListener('application:created', handleApplicationCreated);
    };
  }, []);

  return { roles, companies, resources, applications, loading, error };
}

export default useSiteData;
