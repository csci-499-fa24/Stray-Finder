import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api'
import { useRouter } from 'next/navigation'
import useAuth from '@/app/hooks/useAuth'
import toast from 'react-hot-toast'
import Loader from '../../components/loader/Loader'
import styles from './reportAnimal.module.css'
import { FaCamera } from 'react-icons/fa'
import { Filter } from 'bad-words';


const ReportAnimal = () => {
   const router = useRouter()
   const { isAuthenticated, user } = useAuth()
   const DEFAULT_CENTER = { lat: 40.768, lng: -73.964 } // Default coordinates (e.g., NYC)


   const [formData, setFormData] = useState({
       reportType: '',
       name: '',
       species: '',
       breed: '',
       color: '',
       gender: 'Unknown',
       fixed: 'Unknown',
       collar: false,
       description: '',
       location: '',
       coordinates: DEFAULT_CENTER,
   })


   const [file, setFile] = useState(null) // Store the image file
   const [isOtherBreed, setIsOtherBreed] = useState(false)
   const [commonBreeds, setCommonBreeds] = useState([])
   const [userLocation, setUserLocation] = useState(null)
   const [locationAsked, setLocationAsked] = useState(false)
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState('')


   const speciesOptions = [
       {
           value: 'Dog',
           label: 'Dog',
           breeds: [
               'Labrador Retriever',
               'German Shepherd',
               'Golden Retriever',
               'Bulldog',
               'Beagle',
               'Poodle',
               'Rottweiler',
               'Yorkshire Terrier',
               'Dachshund',
               'Boxer',
               "I don't know",
           ],
       },
       {
           value: 'Cat',
           label: 'Cat',
           breeds: [
               'Persian',
               'Maine Coon',
               'Siamese',
               'Ragdoll',
               'Bengal',
               'Sphynx',
               'British Shorthair',
               "I don't know",
           ],
       },
       {
           value: 'Rabbit',
           label: 'Rabbit',
           breeds: [
               'Holland Lop',
               'Netherland Dwarf',
               'Mini Rex',
               'Lionhead',
               'Flemish Giant',
               "I don't know",
           ],
       },
       {
           value: 'Hamster',
           label: 'Hamster',
           breeds: [
               'Syrian',
               'Dwarf',
               'Roborovski',
               'Chinese',
               "I don't know",
           ],
       },
       {
           value: 'Guinea Pig',
           label: 'Guinea Pig',
           breeds: [
               'American',
               'Abyssinian',
               'Peruvian',
               'Silkie',
               "I don't know",
           ],
       },
       {
           value: 'Lizard',
           label: 'Lizard',
           breeds: [
               'Leopard Gecko',
               'Bearded Dragon',
               'Crested Gecko',
               'Chameleon',
               "I don't know",
           ],
       },
       {
           value: 'Pig',
           label: 'Pig',
           breeds: [
               'Miniature',
               'Teacup',
               'Pot-bellied',
               "I don't know",
           ],
       },
       {
           value: 'Bird',
           label: 'Bird',
           breeds: [
               'Parakeet',
               'Cockatiel',
               'Canary',
               'Lovebird',
               "I don't know",
           ],
       },
       {
           value: 'Ferret',
           label: 'Ferret',
           breeds: ["I don't know"], // Ferrets don't have many distinct breeds
       },
       {
           value: 'Unknown',
           label: "I don't know",
           breeds: []
       },
   ];   


   useEffect(() => {
       if (isAuthenticated === false) {
           router.push('/auth');
       }
  
       const storedLocation = localStorage.getItem('userLocation');
       if (storedLocation) {
           const parsedLocation = JSON.parse(storedLocation);
           setUserLocation(parsedLocation);
           setFormData((prevData) => ({
               ...prevData,
               coordinates: parsedLocation,
               location: `Lat: ${parsedLocation.lat}, Lng: ${parsedLocation.lng}`,
           }));
           return;
       }
  
       if (isAuthenticated && navigator.geolocation && !locationAsked) {
           const askForLocation = window.confirm('Would you like to share your location?');
           if (askForLocation) {
               navigator.geolocation.getCurrentPosition(
                   (position) => {
                       const { latitude, longitude } = position.coords;
                       const locationData = { lat: latitude, lng: longitude };
                       localStorage.setItem('userLocation', JSON.stringify(locationData));
                       setUserLocation(locationData);
                       setFormData((prevData) => ({
                           ...prevData,
                           coordinates: locationData,
                           location: `Lat: ${latitude}, Lng: ${longitude}`,
                       }));
                   },
                   (error) => {
                       console.error('Error getting location:', error);
                       alert('Unable to retrieve your location. Please enter it manually.');
                   }
               );
           }
           setLocationAsked(true);
       }
   }, [isAuthenticated, locationAsked, router]);
  


   if (isAuthenticated === null) {
       return <Loader />;
   }


   if (isAuthenticated === false) {
       return null // Return nothing if the user is not authenticated (will redirect)
   }


   const handleChange = (e) => {
       const { name, value, type, checked } = e.target


       setFormData((prevData) => ({
           ...prevData,
           [name]: type === 'checkbox' ? checked : value,
       }))


       if (name === 'species') {
           const selectedSpecies = speciesOptions.find(
               (species) => species.value === value
           )
           setCommonBreeds(selectedSpecies ? selectedSpecies.breeds : [])
           setFormData((prevData) => ({
               ...prevData,
               breed: '', // Reset breed when species changes
           }))
           setIsOtherBreed(false) // Reset Other option when species changes
       }


       if (name === 'breed') {
           if (value === 'Other') {
               setIsOtherBreed(true)
               setFormData((prevData) => ({
                   ...prevData,
                   breed: 'Other', // Keep "Other" as the dropdown value
               }))
           } else {
               setIsOtherBreed(false)
               setFormData((prevData) => ({
                   ...prevData,
                   breed: value, // Update with selected dropdown value
               }))
           }
       }
   }


   const handleFileChange = (e) => {
       setFile(e.target.files[0]) // Store the selected file
   }


   const calculateDistance = (lat1, lon1, lat2, lon2) => {
       const R = 3959 // Radius of Earth in miles
       const dLat = ((lat2 - lat1) * Math.PI) / 180
       const dLon = ((lon2 - lon1) * Math.PI) / 180
       const a =
           Math.sin(dLat / 2) * Math.sin(dLat / 2) +
           Math.cos((lat1 * Math.PI) / 180) *
               Math.cos((lat2 * Math.PI) / 180) *
               Math.sin(dLon / 2) *
               Math.sin(dLon / 2)
       const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
       return R * c // Distance in miles
   }


   const handleCameraCapture = async () => {
       try {
           const cameraCapture = await navigator.mediaDevices.getUserMedia({
               video: true,
           })


           // Create a video element to capture the snapshot
           const video = document.createElement('video')
           video.srcObject = cameraCapture
           video.play()


           // Create a canvas to hold the captured image
           const canvas = document.createElement('canvas')
           canvas.width = 640 // Set canvas size
           canvas.height = 480


           // Wait for a moment to allow the video to load
           setTimeout(() => {
               const context = canvas.getContext('2d')
               context.drawImage(video, 0, 0, canvas.width, canvas.height)


               // Convert the canvas image to a blob and set it as the file
               canvas.toBlob((blob) => {
                   const capturedImage = new File(
                       [blob],
                       'captured_image.jpg',
                       { type: 'image/jpeg' }
                   )
                   setFile(capturedImage) // Update the state
               })


               // Stop the video stream
               video.srcObject.getTracks().forEach((track) => track.stop())
           }, 1000)
       } catch (error) {
           console.error('Error accessing camera:', error)
           toast.error('Unable to access the camera. Please try again.')
       }
   }
   const handleSubmit = async (e) => {
       e.preventDefault()
       setLoading(true)
       setError('')


       const filter = new Filter();


       // Validate `description` for profanity
       if (filter.isProfane(formData.description)) {
           setLoading(false);
           toast.error(
               'Your report description contains inappropriate language. Please revise it before submitting.'
           );
           return; // Stop submission if profanity is detected
       }


       // Sanitize the `description`
       const sanitizedDescription = filter.clean(formData.description);


       // Check if user location is available
       if (userLocation) {
           const distance = calculateDistance(
               userLocation.lat,
               userLocation.lng,
               formData.coordinates.lat,
               formData.coordinates.lng
           );




           // Validate the distance is within 10 miles
           if (distance > 10) {
               setLoading(false);
               toast.error('You cannot report animals more than 10 miles away.');
               return; // Stop submission if distance exceeds 10 miles
           }
       }


       const uploadData = new FormData()
       uploadData.append('reportType', formData.reportType)
       uploadData.append('name', formData.name)
       uploadData.append('species', formData.species)
       uploadData.append('breed', formData.breed)
       uploadData.append('color', formData.color)
       uploadData.append('gender', formData.gender)
       uploadData.append('fixed', formData.fixed) // Ensure "fixed" is added
       uploadData.append('collar', formData.collar) // Ensure "collar" is added
       uploadData.append('description', formData.description)
       uploadData.append('reportedBy', user._id)


       const locationData = {
           address: formData.location || 'Unknown',
           coordinates: {
               type: 'Point',
               coordinates: [
                   formData.coordinates.lng,
                   formData.coordinates.lat,
               ],
           },
       }


       uploadData.append('location', JSON.stringify(locationData))


       if (file) {
           uploadData.append('image', file)
       }


       try {
           const response = await fetch(
               `${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal-report`,
               {
                   method: 'POST',
                   body: uploadData,
                   credentials: 'include',
               }
           )


           if (!response.ok) {
               throw new Error(`Error: ${response.statusText}`)
           }


           const result = await response.json()
           toast.success('Report submitted successfully!')
           router.push('/')
       } catch (error) {
           setError(error.message)
           toast.error('An error occurred while submitting the report.')
       } finally {
           setLoading(false)
       }
   }


   const handleMapClick = (event) => {
       const lat = event.latLng.lat()
       const lng = event.latLng.lng()
       setFormData((prevData) => ({
           ...prevData,
           coordinates: { lat, lng },
           location: `Lat: ${lat}, Lng: ${lng}`,
       }))
   }


   /*const clearLocation = () => {
   localStorage.removeItem('userLocation');
   setUserLocation(null);
   setFormData((prevData) => ({
       ...prevData,
       coordinates: DEFAULT_CENTER,
       location: '',
   }));
   toast.success('Location data cleared!');
   };*/
  


   const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
   return (
       <div className={`container ${styles.container}`}>
           <div className="row justify-content-center">
               <div className="col-md-8">
                   <div className={`${styles.reportFormContainer}`}>
                       <h2 className={styles.h2}>Report an Animal</h2>
                       {error && (
                           <div className={styles.errorMessage}>{error}</div>
                       )}
                       <form
                           onSubmit={handleSubmit}
                           encType="multipart/form-data"
                       >
                           {/* Select fields */}
                           <div className={styles.formGroup}>
                               <label
                                   htmlFor="reportType"
                                   className={styles.formLabel}
                               >
                                   Report Type
                               </label>
                               <select
                                   className={styles.formSelect}
                                   id="reportType"
                                   name="reportType"
                                   value={formData.reportType}
                                   onChange={handleChange}
                                   required
                               >
                                   <option value="">Select report type</option>
                                   <option value="Lost">Lost</option>
                                   <option value="Stray">Stray</option>
                                   <option value="Found">Found</option>
                               </select>
                           </div>


                           <div className="mb-3">
                               <label htmlFor="name" className="form-label">
                                   Name
                               </label>
                               <input
                                   type="text"
                                   className="form-control"
                                   id="name"
                                   name="name"
                                   value={formData.name}
                                   onChange={handleChange}
                                   required
                               />
                           </div>


                           <div className="mb-3">
                               <label htmlFor="species" className="form-label">
                                   Species
                               </label>
                               <select
                                   className="form-select"
                                   id="species"
                                   name="species"
                                   value={formData.species}
                                   onChange={handleChange}
                                   required
                               >
                                   <option value="">Select species</option>
                                   {speciesOptions.map((species) => (
                                       <option
                                           key={species.value}
                                           value={species.value}
                                       >
                                           {species.label}
                                       </option>
                                   ))}
                               </select>
                           </div>
                           <div className="mb-3">
                               <label htmlFor="breed" className="form-label">
                                   Breed
                               </label>
                               <select
                                   className="form-select"
                                   id="breed"
                                   name="breed"
                                   value={
                                       isOtherBreed ? 'Other' : formData.breed
                                   } // Keep "Other" selected in dropdown
                                   onChange={handleChange}
                                   required
                               >
                                   <option value="">Select breed</option>
                                   {commonBreeds.map((breed) => (
                                       <option key={breed} value={breed}>
                                           {breed}
                                       </option>
                                   ))}
                                   <option value="Other">Other</option>
                               </select>
                               {isOtherBreed && (
                                   <input
                                       type="text"
                                       className="form-control mt-2"
                                       placeholder="Please specify other breed"
                                       value={
                                           formData.breed !== 'Other'
                                               ? formData.breed
                                               : ''
                                       } // Show the custom input value
                                       onChange={(e) =>
                                           setFormData((prevData) => ({
                                               ...prevData,
                                               breed: e.target.value, // Update formData with the custom input value
                                           }))
                                       }
                                       required
                                   />
                               )}
                           </div>
                           <div className="mb-3">
                               <label htmlFor="color" className="form-label">
                                   Color
                               </label>
                               <input
                                   type="text"
                                   className="form-control"
                                   id="color"
                                   name="color"
                                   value={formData.color}
                                   onChange={handleChange}
                                   required
                               />
                           </div>
                           <div className="mb-3">
                               <label htmlFor="gender" className="form-label">
                                   Gender
                               </label>
                               <select
                                   className="form-select"
                                   id="gender"
                                   name="gender"
                                   value={formData.gender}
                                   onChange={handleChange}
                               >
                                   <option value="Unknown">Unknown</option>
                                   <option value="Male">Male</option>
                                   <option value="Female">Female</option>
                               </select>
                           </div>
                           <div className="mb-3">
                               <label htmlFor="fixed" className="form-label">
                                   Is the animal fixed?
                               </label>
                               <select
                                   className="form-select"
                                   id="fixed"
                                   name="fixed"
                                   value={formData.fixed}
                                   onChange={handleChange}
                               >
                                   <option value="Unknown">Unknown</option>
                                   <option value="Yes">Yes</option>
                                   <option value="No">No</option>
                               </select>
                           </div>
                           <div className="mb-3">
                               <label htmlFor="collar" className="form-label">
                                   Does the animal have a collar?
                               </label>
                               <input
                                   type="checkbox"
                                   id="collar"
                                   name="collar"
                                   checked={formData.collar}
                                   onChange={handleChange}
                               />
                           </div>
                           <div className="mb-3">
                               <label
                                   htmlFor="description"
                                   className="form-label"
                               >
                                   Description
                               </label>
                               <textarea
                                   className="form-control"
                                   id="description"
                                   name="description"
                                   rows="3"
                                   value={formData.description}
                                   onChange={handleChange}
                                   required
                               ></textarea>
                           </div>
                           <div className="mb-3">
                               <label
                                   htmlFor="location"
                                   className="form-label"
                               >
                                   Location
                               </label>
                               <input
                                   type="text"
                                   className="form-control"
                                   id="location"
                                   name="location"
                                   value={formData.location}
                                   onChange={handleChange}
                                   required
                               />
                           </div>
                           <div className={styles.imageUploadContainer}>
                               <input
                                   type="file"
                                   className={`${styles.formControl} ${styles.fileInput}`}
                                   id="file"
                                   name="file"
                                   accept="image/*"
                                   capture="user"
                                   onChange={handleFileChange}
                               />
                           </div>
                           {/* Map */}
                           <div className={styles.mapContainer}>
                               <LoadScriptNext googleMapsApiKey={apiKey}>
                                   <GoogleMap
                                       mapContainerStyle={{
                                           height: '100%',
                                           width: '100%',
                                       }}
                                       center={formData.coordinates}
                                       zoom={12}
                                       onClick={handleMapClick}
                                   >
                                       <Marker
                                           position={formData.coordinates}
                                       />
                                   </GoogleMap>
                               </LoadScriptNext>
                           </div>
                           {/*<button
                               type="button"
                               className="btn btn-danger"
                               onClick={clearLocation}
                               style={{ marginTop: '10px' }}
                           >
                               Clear Location
                                   </button>*/}
                           <button
                               type="submit"
                               className={styles.submitButton}
                               disabled={loading}
                           >
                               {loading ? 'Submitting...' : 'Submit'}
                           </button>
                       </form>
                   </div>
               </div>
           </div>
       </div>
   )
}


export default ReportAnimal