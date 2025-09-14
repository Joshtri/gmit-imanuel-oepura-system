export default function OurLocation() {
  return (
    <div>
      <div className="divider divider-start divider-neutral text-3xl text-black">Our Location</div>
      <div className="bg-gray-100 mt-8">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d981.7226481810433!2d123.60636807103121!3d-10.189539637452759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2c569b4f7ad821c9%3A0x994b9e248ff1384a!2sCPCT%20Imanuel%20Oepura%20Parish!5e0!3m2!1sen!2sid!4v1755077287280!5m2!1sen!2sid"
          width="600"
          height="450"
          style={{ border: 0 }}
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          className="w-full"
        ></iframe>
      </div>
    </div>
  );
}
