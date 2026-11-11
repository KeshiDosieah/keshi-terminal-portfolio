import { ArrowUpRight, BriefcaseBusiness, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const contacts = [
{ label: 'EMAIL', value: 'k.dosieah00@gmail.com', href: 'mailto:k.dosieah00@gmail.com', Icon: Mail },
{ label: 'LINKEDIN', value: 'linkedin.com/in/keshi-dosieah', href: 'https://www.linkedin.com/in/keshi-dosieah/', Icon: BriefcaseBusiness },
{ label: 'PHONE', value: '+44 7887 011617', href: 'tel:+447887011617', Icon: Phone },
];

export default function Contact() {
  return (
    <div className="document-page contact-page w-full">
      <p className="skill-browser-path"><span>~/</span>contact/</p>
      <p className="eyebrow">GET IN TOUCH</p>
      <h1>Let’s build something useful.</h1>
      <p className="contact-intro">
        I’m a software engineer, and I’m open to roles where data and applied AI are part of the work.
        If this sounds like your team, you know where to reach me.
      </p>

      <div className="contact-cards" aria-label="Contact links">
        {contacts.map(({ label, value, href, Icon }) => {
          const content = (
            <>
              <span className="contact-card-icon"><Icon aria-hidden="true" /></span>
              <span className="contact-card-copy">
                <span>{label}</span>
                <strong>{value}</strong>
              </span>
              {href && <ArrowUpRight className="contact-card-arrow" aria-hidden="true" />}
            </>
          );

          return href ? (
            <a className="contact-card" key={label} href={href} target="_blank" rel="noreferrer">
              {content}
            </a>
          ) : (
            <div className="contact-card is-unconfigured" key={label}>
              {content}
            </div>
          );
        })}
      </div>

      <div className="contact-availability">
        <span aria-hidden="true" />
        OPEN TO SOFTWARE · DATA · APPLIED AI
      </div>

    </div>
  );
}
