"use client"
import {
  useState
} from "react"
import {
  toast
} from "sonner"
import {
  useForm
} from "react-hook-form"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  cn
} from "@/lib/utils"
import {
  Button
} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Input
} from "@/components/ui/input"
import {
  format
} from "date-fns"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import {
  Calendar
} from "@/components/ui/calendar"
import {
  Calendar as CalendarIcon
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Slider
} from "@/components/ui/slider"

const formSchema = z.object({
  name_8375402145: z.string(),
  name_4895316374: z.coerce.date(),
  : z.string(),
  name_8947632444: z.string(),
  name_5329758065: z.number()
});

export default function MenuItemForm() {

    const form = useForm < z.infer < typeof formSchema >> ({
        resolver: zodResolver(formSchema),
        defaultValues: {
        "name_4895316374": new Date()
        },
    })

    const [dishId, setDishId] = useState('');
    const [dishes, setDishes] = useState([]);
    const [dayOfWeek, setDayOfWeek] = useState('Monday');
    const [label, setLabel] = useState('Lunch');
    const [quantity, setQuantity] = useState(1);

    

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const res = await fetch('/api/dish');
                const data = await res.json();
                setDishes(data);
            } catch (e) {
                console.log('Error fetching dishes: ', error);
            }
        };
        fetchDishes();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const body = { user_id: 1, dish_id: parseInt(dishId), quantity, label, day_of_week: dayOfWeek };
            const res = await fetch('/api/menu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (res.ok) {
                setDishId('');
                setQuantity(1);
                setLabel('Lunch');
                setDayOfWeek('Monday');
                alert('Menu item created successfully');
            } else {
                console.error('Error creating menu item');
            }
        } catch (error) {
            console.error('Error:', error);
        };
    };

  function onSubmit(values: z.infer < typeof formSchema > ) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
        
        <FormField
          control={form.control}
          name="name_8375402145"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input 
                placeholder="shadcn"
                
                type=""
                {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
      <FormField
      control={form.control}
      name="name_4895316374"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Date of birth</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
       <FormDescription>Your date of birth is used to calculate your age.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
        
        <FormField
          control={form.control}
          name=""
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
                <FormDescription>You can manage email addresses in your email settings.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="name_8947632444"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
                <FormDescription>You can manage email addresses in your email settings.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
            <FormField
              control={form.control}
              name="name_5329758065"
              render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel>Price - {value}</FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    defaultValue={[5]}
                    onValueChange={(vals) => {
                      onChange(vals[0]);
                    }}
                  />
                </FormControl>
                <FormDescription>Adjust the price by sliding.</FormDescription>
                <FormMessage />
              </FormItem>
              )}
            />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}



    
 
