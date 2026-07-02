import RequestVisaForm from "@/components/request-visa-form";

export default function RequestVisa() {
  return (
    <div className="bg-linear-to-b from-dark-orange via-light-orange to-white w-full py-20">
      <div className="mx-auto w-full px-4 md:px-6 max-w-7xl">
        <RequestVisaForm />
      </div>
    </div>
  );
}
