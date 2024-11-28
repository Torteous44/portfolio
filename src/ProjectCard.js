import React from 'react';
import './ProjectCard.css'; 
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectCard = ({ 
  title, 
  description, 
  image, 
  technologies = [], 
  githubLink, 
  liveDemoLink 
}) => {


  return (


    <div className="project-card">
      {image && (
        <div className="project-image">
          <img src={image} alt={`${title} screenshot`} />
        </div>
      )}

      <div className="project-content">
        <h3>{title}</h3>
        <p>{description}</p>

        {technologies.length > 0 && (
          <ul className="technologies">
            {technologies.map((tech, index) => (
              <li key={index}>{tech}</li>
            ))}
          </ul>
        )}

        <div className="project-links">
          {githubLink && (
            <a 
              href={githubLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
          )}


          {liveDemoLink && (
            <a 
              href={liveDemoLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Live Demo"
            >
              <FaExternalLinkAlt />
            </a>

            
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
