import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// eslint-disable-next-line react/prop-types

import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faStar,
  faTrash,
  faIdCard,
  faUser,
  faPhone,
  faEnvelope,
  faImage,
  faUserCircle,
  faInfoCircle,
  faCity,
  faBriefcase,
  faImages,
} from "@fortawesome/free-solid-svg-icons";
import { MapPin, Mail, Link as LinkIcon } from "lucide-react";

function Review({ onDelete, id, image, name, comment, stars, date }) {
  function handelDeleteBtn() {
    axios
      .delete(`http://bricolat.free.nf/admin/deleteReview.php?reviewID=${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("review deleted successfully", response.data);
        onDelete();
      })
      .catch((error) => {
        console.error("There was an error deleting the review!", error);
      });
  }
  return (
    <div className="bg-white  my-4 p-4 rounded-xl shadow-md   w-full max-w-md  ">
      <div className="flex items-center justify-center mb-2">
        <img
          src={image}
          alt={name}
          className="w-14 h-14 rounded-full object-cover mr-3"
        />
        <h3 className="text-lg font-semibold">{name}</h3>
      </div>

      {/* Stars under name */}
      <div className="flex justify-center mb-2">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${
              i < stars ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.263 3.91a1 1 0 00.95.69h4.116c.969 0 1.371 1.24.588 1.81l-3.33 2.417a1 1 0 00-.364 1.118l1.263 3.91c.3.921-.755 1.688-1.538 1.118L10 13.347l-3.33 2.417c-.783.57-1.838-.197-1.538-1.118l1.263-3.91a1 1 0 00-.364-1.118L2.7 9.337c-.783-.57-.38-1.81.588-1.81h4.116a1 1 0 00.95-.69l1.263-3.91z" />
          </svg>
        ))}
      </div>

      {/* Review Comment */}
      <p className=" justify-self-center text-gray-700">{comment}</p>
      <div className="  justify-self-end text-sm text-gray-500">{date}</div>
      <div className="justify-self-center text-sm">
        <button onClick={() => handelDeleteBtn(id)} className="px-3 py-1    ">
          {" "}
          <FontAwesomeIcon
            icon={faTrash}
            size="2xl"
            className=" text-gray-600 hover:text-red-600"
          />
        </button>
      </div>
    </div>
  );
}

const UpdateProfileForm = ({ OldData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    workerID: OldData?.workerID, // should note be modified
    userId: OldData?.userId,
    fullName: OldData?.fullName || "",
    phone: OldData?.phone || "",
    email: OldData?.email || "",
    image: OldData?.image,
    inscriptionDate: OldData?.inscriptionDate || "",
    userName: OldData?.userName || "",
    description: OldData?.description || "",
    workingCityLocation: OldData?.workingCityLocation || "",
    rating: OldData?.rating || "",
    reviews: OldData?.reviews || [],
    jobCategories: OldData?.jobCategories || [],
    workingImages: OldData?.workingImages || [],
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (e.target.name === "image") {
      setFormData((prev) => ({
        ...prev,
        image: files[0], // Store single profile image
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        workingImages: [...prev.workingImages, ...files], // Add to working images array
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.userName.trim()) newErrors.userName = "Username is required";

    if (formData.jobCategories.length === 0)
      newErrors.jobCategories = "job categories required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const [jobCategoriesList, setJobCategoriesList] = useState([]);

  const toggleCategory = (category) => {
    setFormData((prev) => {
      const isSelected = prev.jobCategories.some(
        (c) => c.categoryID === category.categoryID
      );

      return {
        ...prev,
        jobCategories: isSelected
          ? prev.jobCategories.filter(
              (c) => c.categoryID !== category.categoryID
            )
          : [...prev.jobCategories, category],
      };
    });
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    axios
      .get(`http://bricolat.free.nf/admin/getJobCategoriesList.php`, {
        withCredentials: true,
      })
      .then((response) => {
        setJobCategoriesList(response.data);
      })
      .catch((err) => console.error("Failed to fetch job categories", err));
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex  grid sm:grid-cols-7 justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg sm:col-start-3 col-span-3   max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold text-gray-900">
            Edite Worker information
          </h1>
          <div className="space-y-6">
            {/* ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ID
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <FontAwesomeIcon icon={faIdCard} />
                </span>
                <input
                  type="text"
                  value={formData.workerID}
                  disabled
                  className="pl-10 mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <FontAwesomeIcon icon={faPhone} />
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Image
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <FontAwesomeIcon icon={faImage} />
                </span>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <FontAwesomeIcon icon={faUserCircle} />
                </span>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {errors.userName && (
                <p className="mt-1 text-sm text-red-600">{errors.userName}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <FontAwesomeIcon icon={faInfoCircle} />
                </span>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Working City Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <FontAwesomeIcon icon={faCity} />
                </span>
                <input
                  type="text"
                  name="workingCityLocation"
                  value={formData.workingCityLocation}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rating
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <FontAwesomeIcon icon={faStar} />
                </span>
                <input
                  type="number"
                  name="rating"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Job Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Categories
              </label>

              <div className="relative mb-2">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none">
                  <FontAwesomeIcon icon={faBriefcase} />
                </span>
                <input
                  name="jobCategories"
                  type="text"
                  disabled
                  value={formData.jobCategories
                    .map((cat) => cat.categoryTitle)
                    .join(", ")}
                  className="pl-10 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm cursor-not-allowed"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {jobCategoriesList.map((category) => {
                  const selected = formData.jobCategories.some(
                    (c) => c.categoryID === category.categoryID
                  );

                  return (
                    <button
                      key={category.categoryID}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`px-3 py-1 text-sm rounded-full border transition ${
                        selected
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {category.categoryTitle}
                    </button>
                  );
                })}
              </div>
              {errors.jobCategories && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.jobCategories}
                </p>
              )}
            </div>

            {/* Working Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last work
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <FontAwesomeIcon icon={faImages} />
                </span>

                <input
                  type="file"
                  name="workingImages[]"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-12 gap-4 ">
              <div className="pt-5 sm:col-start-3 sm:col-span-4 ">
                <button
                  onClick={onClose}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {" "}
                  Cancel ✕
                </button>
              </div>
              <div className="pt-5   sm:col-span-4 ">
                {" "}
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const WorkerProfile = () => {
  const { workerID } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [worker, setWorkerInfo] = useState({
    workerID: "", // should note be modified
    userID: "",
    fullName: "",
    phone: "",
    email: "",
    imageUrl: "",
    inscriptionDate: "",
    userName: "",
    description: "",
    workingCityLocation: "",
    rating: "",
    jobCategories: [],
    workingImages: [],
    reviews: [
      {
        id: "",
        reviewerName: "",
        comment: "",
        starsNumber: 0,
        date: "",
        imageUrl: "",
      },
    ],
  });

  const handleSubmit = (newFormData) => {
    setShowUpdateForm(false);

    const updateDatabase = async () => {
      const formData = new FormData();

      formData.append("workerID", newFormData.workerID);
      formData.append("userID", newFormData.userId);
      formData.append("fullName", newFormData.fullName);
      formData.append("phone", newFormData.phone);
      formData.append("email", newFormData.email);
      formData.append("inscriptionDate", newFormData.inscriptionDate);
      formData.append("userName", newFormData.userName);
      formData.append("description", newFormData.description);
      formData.append("workingCityLocation", newFormData.workingCityLocation);
      formData.append("rating", newFormData.rating);
      // Append job categories as a JSON string
      formData.append(
        "jobCategories",
        JSON.stringify(newFormData.jobCategories)
      );

      // Append working images (multiple files)
      newFormData.workingImages.forEach((file) => {
        formData.append("workingImages[]", file);
      });

      // Append profile image
      if (newFormData.image) {
        formData.append("image", newFormData.image);
      }

      try {
        const response = await axios.post(
          `http://bricolat.free.nf/admin/updateWorkerInfo.php?workerID=${workerID}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Tell Axios that you're sending form data
            },
            withCredentials: true,
          }
        );

        console.log("Response from server:", response.data);
      } catch (error) {
        console.error("Error occurred while sending data:", error);
      }
    };

    const fetchData = async () => {
      const info = await getWorkerInfo(); // Wait for the API call to resolve

      if (info) {
        setWorkerInfo({ workerID: workerID, ...info });
      } else {
        console.log("Error fetching worker info");
      }
    };

    updateDatabase().then(fetchData);
  };
  const getWorkerInfo = async () => {
    try {
      const response = await axios.get(
        `http://bricolat.free.nf/admin/getWorkerInfo.php?workerID=${workerID}`,
        { withCredentials: true }
      );
      return response.data; // Return the data from the response
    } catch (error) {
      console.error("There was an error fetching the data!", error);
      return false; // Return false if error
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const info = await getWorkerInfo(); // Wait for the API call to resolve

      if (info) {
        setWorkerInfo({ workerID: workerID, ...info });
      } else {
        console.log("error fetching worker info");
      }
    };

    fetchData(); // Call the async function
  }, [workerID]);

  function ContactViaWhatssap() {
    const url = `https://wa.me/${worker.phone}?text=${encodeURIComponent(
      "hello"
    )}`;
    window.open(url, "_blank");
  }
  return (
    <div id="dvWorkerProfile" className="min-h-screen   bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div
            className="h-48 w-full bg-cover bg-center"
            style={{
              backgroundColor:
                "#" + Math.floor(Math.random() * 16777215).toString(16),
            }}
          />

          <div className="relative px-6 pb-6">
            {/* Profile Image */}
            <div className="absolute -top-16">
              {console.log(worker)}
              <img
                src={worker.image}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
            </div>

            {/* Profile Info */}
            <div className="absolute -top-5 right-2">
              <button
                onClick={() => setShowUpdateForm(true)}
                className="  px-10 py-1 bg-gray-800 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Update Profile
              </button>
            </div>

            <div className="pt-20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {worker.userName}
                  </h1>
                  <p className="text-gray-600">{worker.fullName}</p>
                </div>
                <div className=" col-span-2   flex flex-column gap-2">
                  <FontAwesomeIcon icon={faStar} size="2x" color="#ffc107" />

                  <h2 className="font-bold text-xl pt-1">{worker.rating}</h2>
                </div>

                <button
                  onClick={ContactViaWhatssap}
                  className="  px-10 py-1 bg-[#198754] text-white rounded-lg hover:bg-green-800 transition-colors"
                >
                  <FontAwesomeIcon icon={faWhatsapp} size="2x" />
                </button>
              </div>
              <div className="grid sm:grid-cols-12 gap-2  pb-2  ">
                {worker.jobCategories.map((element, index) => (
                  <div
                    className="border  sm:col-span-2 w-max text-xs font-semibold rounded-lg  px-2 py-1  "
                    key={index}
                  >
                    {element.categoryTitle}
                  </div>
                ))}
              </div>

              <p className="text-gray-700 mt-2 mb-4">{worker.description}</p>

              {/* User Details */}
              <div className="grid border rounded-xl p-4 my-2  grid-cols-1 md:grid-cols-2 gap-2  ">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  {worker.workingCityLocation}
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-2" />
                  {worker.email}
                </div>
                <div className="flex items-center  text-gray-600">
                  <LinkIcon className="w-5 h-5 mr-2" />
                  {worker.phone}
                </div>
              </div>
              <p className="text-md font-bold text-gray-600">Past Work</p>
              <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-6">
                {worker.workingImages.length === 0 ? (
                  <div className="w-full h-40  font-semibold text-gray-600 flex items-center justify-center text-center shadow-md rounded bg-gray-200">
                    no past work yet
                  </div>
                ) : (
                  worker.workingImages.map((element, index) => (
                    <div key={index} className="w-full">
                      <img
                        onClick={() => setSelectedImage(element)}
                        src={element}
                        alt="worker image"
                        className="w-full h-40 object-cover shadow-md rounded cursor-pointer "
                      />
                    </div>
                  ))
                )}
              </div>
              <p className="text-md font-bold text-gray-600">
                Feedbacks and reviews
              </p>
              <div className="grid sm:grid-cols-12 gap-4">
                {worker.reviews.length === 0 ? (
                  <p className="text-xl font-bold text-gray-700 col-span-12 text-center">
                    No reviews to show
                  </p>
                ) : (
                  worker.reviews.map((element, index) => (
                    <div key={index} className="sm:col-span-6">
                      <Review
                        onDelete={() =>
                          setWorkerInfo((prev) => ({
                            ...prev,
                            reviews: prev.reviews.filter(
                              (review) => review.id !== element.id
                            ),
                          }))
                        }
                        image={element.imageUrl}
                        name={element.reviewerName}
                        comment={element.comment}
                        stars={element.starsNumber}
                        date={element.date}
                        id={element.id}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showUpdateForm && (
        <UpdateProfileForm
          OldData={worker}
          onSubmit={handleSubmit}
          onClose={() => setShowUpdateForm(false)}
        ></UpdateProfileForm>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full view"
            className="max-w-full max-h-full rounded shadow-lg"
          />
        </div>
      )}
    </div>
  );
};
export default WorkerProfile;
