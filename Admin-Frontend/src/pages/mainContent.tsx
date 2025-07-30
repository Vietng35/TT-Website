import AssignLecturerToCourse from '@/components/AssignLecturerToCourse';
import CourseTableCourseManagement from '@/components/CourseTableCourseManagement';
import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";

export default function MainContent() {
    const { user } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (!user) {
            router.replace("/loginForAdmin")
        }
    }, [router, user]);

    return (
        <div
            className={`grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
        >
            <AssignLecturerToCourse />
            <CourseTableCourseManagement />
        </div>
    );
}
