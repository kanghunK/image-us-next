import UploadImageModal from "@/components/UploadImageModal";

export default function UploadImage({ params }: { params: { id: string } }) {
    return <UploadImageModal roomId={params.id} />;
}
