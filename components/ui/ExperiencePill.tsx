import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ChevronDown } from 'lucide-react';
import './ExperiencePill.css';

export type ExperiencePillProps = {
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string;
  technologies?: string[];
  type?: string;
};

const ExperiencePill = ({ 
  company, 
  position, 
  duration, 
  location, 
  description, 
  technologies = [],
  type = "Full-time"
}: ExperiencePillProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="experience-pill-container">
      <motion.div
        className="experience-pill"
        onHoverStart={() => setIsExpanded(true)}
        onHoverEnd={() => setIsExpanded(false)}
        onClick={handleToggle}
        whileHover={{ 
          scale: 1.02,
          y: -5
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ cursor: 'pointer' }}
      >
        {/* Main Pill Content */}
        <div className="pill-header">
          <div className="pill-main">
            <h3 className="position-title">{position}</h3>
            <div className="company-info">
              <span className="company-name">{company}</span>
              <span className="job-type">{type}</span>
            </div>
          </div>
          
          <div className="pill-meta">
            <div className="meta-item">
              <Calendar size={16} />
              <span>{duration}</span>
            </div>
            <div className="meta-item">
              <MapPin size={16} />
              <span>{location}</span>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={16} />
            </motion.div>
          </div>
        </div>

        {/* Animated Dropdown */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="pill-dropdown"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="dropdown-content">
                <p className="job-description">{description}</p>
                {technologies.length > 0 && (
                  <div className="technologies">
                    <h4>Technologies Used:</h4>
                    <div className="tech-tags">
                      {technologies.map((tech, index) => (
                        <motion.span
                          key={tech}
                          className="tech-tag"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ExperiencePill;
