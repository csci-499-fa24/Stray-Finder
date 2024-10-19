import Link from 'next/link'
import { useState } from 'react'
import './cards.css'

const StrayCard = ({ id, name, image, species, breed, gender, state, description }) => {
   // State to manage if the modal is open
   const [isModalOpen, setModalOpen] = useState(false);
   const [selectedReason, setSelectedReason] = useState('');


   // Function to handle reporting
   const handleReportClick = () => {
       setModalOpen(true);  // Open the modal when Report is clicked
   };


   // Function to submit report
   const submitReport = () => {
       // Handle the report submission logic
       console.log(`Report for post ${id} with reason: ${selectedReason}`);
       setModalOpen(false);
   };


   return (
       <div className="col position-relative">
           <div className="card m-3 p-0">
               <img src={image} className="card-img-top" alt={name} />
               <div className="card-body">
                   <h5 className="card-title">{name}</h5>
                   <p className="card-text">{description}</p>
               </div>
               <ul className="list-group list-group-flush">
                   <li className="list-group-item">Species: {species}</li>
                   <li className="list-group-item">Gender: {gender}</li>
                   <li className="list-group-item">State: {state}</li>
               </ul>
               <div className="card-body">
                   <Link href={`/animal/${id}`} className="card-link">
                       Read More
                   </Link>
                   <button className="report-btn" onClick={handleReportClick}>
                       Report
                   </button>
               </div>


               {/* Modal for reporting */}
               {isModalOpen && (
                   <div className="modal">
                       <div className="modal-content">
                           <h4>Report Post</h4>
                           <p>Why do you want to report this post?</p>
                           <select value={selectedReason} onChange={(e) => setSelectedReason(e.target.value)}>
                               <option value="">Select a reason</option>
                               <option value="spam">Spam</option>
                               <option value="offensive">Offensive Content</option>
                               <option value="inaccurate">Inaccurate Information</option>
                           </select>
                           <button onClick={submitReport}>Submit Report</button>
                           <button onClick={() => setModalOpen(false)}>Cancel</button>
                       </div>
                   </div>
               )}
           </div>
       </div>
   );
};


export default StrayCard;



