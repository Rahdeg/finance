import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { insertCategorieSchema } from "@/db/schema";
import { z } from "zod";
import { useGetCategory } from "../api/use-get-category";
import { useOpenCategory } from "../hooks/use-open-category";
import { Loader2 } from "lucide-react";
import { useEditCategory } from "../api/use-edit-category";
import { useDeleteCategory } from "../api/use-delete-category";
import { useConfirm } from "@/hooks/use-confirm";
import CategoryForm from "./category-form";

export const EditCategorySheet = () => {
    const { isOpen, onClose, id } = useOpenCategory();
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this category"
    )

    const categoryQuery = useGetCategory(id);
    const editMutation = useEditCategory(id);
    const deleteMutation = useDeleteCategory(id);

    const isPending = editMutation.isPending || deleteMutation.isPending;

    const isLoading = categoryQuery.isLoading;

    const formSchema = insertCategorieSchema.pick({
        name: true
    });

    type FormValues = z.input<typeof formSchema>;




    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const onDelete = async () => {
        const ok = await confirm();

        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                }
            })
        }

    }

    const defaultValues = categoryQuery.data ? {
        name: categoryQuery.data.name
    } : {
        name: "",
    }



    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>
                            Edit Category
                        </SheetTitle>
                        <SheetDescription>
                            Edit your  category to track your transactions.
                        </SheetDescription>
                    </SheetHeader>
                    {
                        isLoading ? (
                            <div className=" absolute inset-0 flex items-center justify-center">
                                <Loader2 className=" size-4 text-muted-foreground animate-spin" />
                            </div>
                        ) : (<CategoryForm onSubmit={onSubmit} disabled={isPending} defaultValues={defaultValues} id={id} onDelete={onDelete} />)
                    }

                </SheetContent>
            </Sheet>
        </>

    );
};