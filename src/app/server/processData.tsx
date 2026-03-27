import {supabase} from "@/app/server/supabaseClient"

export async function processData(
    first_name: string,
    last_name: string,
    email_address: string,
    phone_number: string,
    address: string,
    notes: string
) {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        console.error("No signed-in user found:", userError?.message);
        return {error: userError, data: null};
    }
    const {data, error} = await supabase.from("customers").insert({
        first_name,
        last_name,
        email_address,
        phone_number,
        address,
        notes,
        user_id: user.id,
    });

    if(error) {
        console.error("Error inserting user:", 
            error.message, 
            error.details, 
            error.hint);
    } else {
        console.log("User added:", data);
    }

    return {error, data};
}
