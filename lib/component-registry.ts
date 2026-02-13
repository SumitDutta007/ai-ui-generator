// Fixed Component Registry - NEVER MODIFIED BY AI
// This is the schema that AI uses to generate code

export interface ComponentSchema {
  name: string;
  props: Record<
    string,
    {
      type: string;
      required: boolean;
      options?: string[];
      default?: string | number | boolean;
    }
  >;
  description: string;
  category:
    | "layout"
    | "input"
    | "display"
    | "feedback"
    | "navigation"
    | "overlay"
    | "data-viz";
  example: string;
}

export const COMPONENT_REGISTRY: Record<string, ComponentSchema> = {
  // ========== LAYOUT COMPONENTS ==========
  Container: {
    name: "Container",
    category: "layout",
    description: "Main container with max-width and padding",
    props: {
      children: { type: "ReactNode", required: true },
      maxWidth: {
        type: "string",
        required: false,
        options: ["sm", "md", "lg", "xl", "2xl", "full"],
        default: "xl",
      },
    },
    example: '<Container maxWidth="lg">{children}</Container>',
  },

  Grid: {
    name: "Grid",
    category: "layout",
    description: "Responsive grid layout",
    props: {
      children: { type: "ReactNode", required: true },
      cols: {
        type: "number",
        required: false,
        options: ["1", "2", "3", "4", "6", "12"],
        default: "3",
      },
      gap: {
        type: "string",
        required: false,
        options: ["sm", "md", "lg"],
        default: "md",
      },
    },
    example: '<Grid cols={3} gap="md">{children}</Grid>',
  },

  Flex: {
    name: "Flex",
    category: "layout",
    description: "Flexbox container",
    props: {
      children: { type: "ReactNode", required: true },
      direction: {
        type: "string",
        required: false,
        options: ["row", "col"],
        default: "row",
      },
      justify: {
        type: "string",
        required: false,
        options: ["start", "center", "end", "between", "around"],
        default: "start",
      },
      align: {
        type: "string",
        required: false,
        options: ["start", "center", "end", "stretch"],
        default: "start",
      },
      gap: {
        type: "string",
        required: false,
        options: ["sm", "md", "lg"],
        default: "md",
      },
    },
    example:
      '<Flex direction="row" justify="between" align="center">{children}</Flex>',
  },

  Stack: {
    name: "Stack",
    category: "layout",
    description: "Vertical stack with spacing",
    props: {
      children: { type: "ReactNode", required: true },
      spacing: {
        type: "string",
        required: false,
        options: ["sm", "md", "lg", "xl"],
        default: "md",
      },
    },
    example: '<Stack spacing="lg">{children}</Stack>',
  },

  // ========== DISPLAY COMPONENTS ==========
  Card: {
    name: "Card",
    category: "display",
    description: "Card container with optional header and footer",
    props: {
      children: { type: "ReactNode", required: true },
      title: { type: "string", required: false },
      subtitle: { type: "string", required: false },
      footer: { type: "ReactNode", required: false },
      variant: {
        type: "string",
        required: false,
        options: ["default", "bordered", "elevated"],
        default: "default",
      },
    },
    example: '<Card title="Dashboard" subtitle="Overview">{children}</Card>',
  },

  Table: {
    name: "Table",
    category: "display",
    description: "Data table with columns and rows",
    props: {
      columns: {
        type: "Array<{key: string, label: string}>",
        required: true,
      },
      data: {
        type: "Array<Record<string, any>>",
        required: true,
      },
      striped: { type: "boolean", required: false, default: true },
      hoverable: { type: "boolean", required: false, default: true },
    },
    example: '<Table columns={[{key: "name", label: "Name"}]} data={users} />',
  },

  Badge: {
    name: "Badge",
    category: "display",
    description: "Small badge/tag component",
    props: {
      children: { type: "ReactNode", required: true },
      variant: {
        type: "string",
        required: false,
        options: ["default", "success", "warning", "error", "info"],
        default: "default",
      },
      size: {
        type: "string",
        required: false,
        options: ["sm", "md", "lg"],
        default: "md",
      },
    },
    example: '<Badge variant="success">Active</Badge>',
  },

  Avatar: {
    name: "Avatar",
    category: "display",
    description: "User avatar with initials or image",
    props: {
      name: { type: "string", required: false },
      src: { type: "string", required: false },
      size: {
        type: "string",
        required: false,
        options: ["sm", "md", "lg", "xl"],
        default: "md",
      },
    },
    example: '<Avatar name="John Doe" size="lg" />',
  },

  // ========== INPUT COMPONENTS ==========
  Button: {
    name: "Button",
    category: "input",
    description: "Interactive button",
    props: {
      children: { type: "ReactNode", required: true },
      variant: {
        type: "string",
        required: false,
        options: ["primary", "secondary", "outline", "ghost", "danger"],
        default: "primary",
      },
      size: {
        type: "string",
        required: false,
        options: ["sm", "md", "lg"],
        default: "md",
      },
      disabled: { type: "boolean", required: false, default: false },
      fullWidth: { type: "boolean", required: false, default: false },
    },
    example: '<Button variant="primary" size="md">Click Me</Button>',
  },

  Input: {
    name: "Input",
    category: "input",
    description: "Text input field",
    props: {
      label: { type: "string", required: false },
      placeholder: { type: "string", required: false },
      type: {
        type: "string",
        required: false,
        options: ["text", "email", "password", "number"],
        default: "text",
      },
      disabled: { type: "boolean", required: false, default: false },
      required: { type: "boolean", required: false, default: false },
    },
    example: '<Input label="Email" placeholder="Enter email" type="email" />',
  },

  Textarea: {
    name: "Textarea",
    category: "input",
    description: "Multi-line text input",
    props: {
      label: { type: "string", required: false },
      placeholder: { type: "string", required: false },
      rows: { type: "number", required: false, default: 4 },
      disabled: { type: "boolean", required: false, default: false },
    },
    example: '<Textarea label="Description" rows={6} />',
  },

  Select: {
    name: "Select",
    category: "input",
    description: "Dropdown select",
    props: {
      label: { type: "string", required: false },
      options: {
        type: "Array<{value: string, label: string}>",
        required: true,
      },
      placeholder: { type: "string", required: false },
      disabled: { type: "boolean", required: false, default: false },
    },
    example:
      '<Select label="Country" options={[{value: "us", label: "USA"}]} />',
  },

  Checkbox: {
    name: "Checkbox",
    category: "input",
    description: "Checkbox input",
    props: {
      label: { type: "string", required: false },
      disabled: { type: "boolean", required: false, default: false },
      checked: { type: "boolean", required: false, default: false },
    },
    example: '<Checkbox label="I agree to terms" />',
  },

  Switch: {
    name: "Switch",
    category: "input",
    description: "Toggle switch",
    props: {
      label: { type: "string", required: false },
      disabled: { type: "boolean", required: false, default: false },
      checked: { type: "boolean", required: false, default: false },
    },
    example: '<Switch label="Enable notifications" />',
  },

  // ========== FEEDBACK COMPONENTS ==========
  Alert: {
    name: "Alert",
    category: "feedback",
    description: "Alert message box",
    props: {
      children: { type: "ReactNode", required: true },
      variant: {
        type: "string",
        required: false,
        options: ["info", "success", "warning", "error"],
        default: "info",
      },
      title: { type: "string", required: false },
      dismissible: { type: "boolean", required: false, default: false },
    },
    example:
      '<Alert variant="success" title="Success">Operation completed</Alert>',
  },

  Progress: {
    name: "Progress",
    category: "feedback",
    description: "Progress bar",
    props: {
      value: { type: "number", required: true },
      max: { type: "number", required: false, default: 100 },
      variant: {
        type: "string",
        required: false,
        options: ["default", "success", "warning", "error"],
        default: "default",
      },
      showLabel: { type: "boolean", required: false, default: true },
    },
    example: '<Progress value={75} max={100} variant="success" />',
  },

  Spinner: {
    name: "Spinner",
    category: "feedback",
    description: "Loading spinner",
    props: {
      size: {
        type: "string",
        required: false,
        options: ["sm", "md", "lg"],
        default: "md",
      },
      variant: {
        type: "string",
        required: false,
        options: ["default", "primary"],
        default: "default",
      },
    },
    example: '<Spinner size="lg" variant="primary" />',
  },

  // ========== NAVIGATION COMPONENTS ==========
  Navbar: {
    name: "Navbar",
    category: "navigation",
    description: "Top navigation bar",
    props: {
      brand: { type: "ReactNode", required: false },
      children: { type: "ReactNode", required: true },
      sticky: { type: "boolean", required: false, default: false },
    },
    example: '<Navbar brand="MyApp">{navItems}</Navbar>',
  },

  Sidebar: {
    name: "Sidebar",
    category: "navigation",
    description: "Side navigation panel",
    props: {
      children: { type: "ReactNode", required: true },
      position: {
        type: "string",
        required: false,
        options: ["left", "right"],
        default: "left",
      },
      width: {
        type: "string",
        required: false,
        options: ["sm", "md", "lg"],
        default: "md",
      },
    },
    example: '<Sidebar position="left" width="md">{menuItems}</Sidebar>',
  },

  Tabs: {
    name: "Tabs",
    category: "navigation",
    description: "Tabbed interface",
    props: {
      tabs: {
        type: "Array<{id: string, label: string, content: ReactNode}>",
        required: true,
      },
      defaultTab: { type: "string", required: false },
    },
    example:
      '<Tabs tabs={[{id: "1", label: "Tab 1", content: <div>Content</div>}]} />',
  },

  Breadcrumb: {
    name: "Breadcrumb",
    category: "navigation",
    description: "Breadcrumb navigation",
    props: {
      items: {
        type: "Array<{label: string, href?: string}>",
        required: true,
      },
    },
    example:
      '<Breadcrumb items={[{label: "Home", href: "/"}, {label: "Page"}]} />',
  },

  // ========== OVERLAY COMPONENTS ==========
  Modal: {
    name: "Modal",
    category: "overlay",
    description: "Modal dialog",
    props: {
      children: { type: "ReactNode", required: true },
      title: { type: "string", required: false },
      isOpen: { type: "boolean", required: true },
      onClose: { type: "function", required: true },
      size: {
        type: "string",
        required: false,
        options: ["sm", "md", "lg", "xl", "full"],
        default: "md",
      },
    },
    example:
      '<Modal title="Settings" isOpen={true} onClose={() => {}}>{content}</Modal>',
  },

  Drawer: {
    name: "Drawer",
    category: "overlay",
    description: "Slide-out drawer",
    props: {
      children: { type: "ReactNode", required: true },
      isOpen: { type: "boolean", required: true },
      onClose: { type: "function", required: true },
      position: {
        type: "string",
        required: false,
        options: ["left", "right", "top", "bottom"],
        default: "right",
      },
    },
    example:
      '<Drawer isOpen={true} onClose={() => {}} position="right">{content}</Drawer>',
  },

  // ========== DATA VISUALIZATION ==========
  BarChart: {
    name: "BarChart",
    category: "data-viz",
    description: "Bar chart visualization",
    props: {
      data: {
        type: "Array<{name: string, value: number}>",
        required: true,
      },
      height: { type: "number", required: false, default: 300 },
      color: { type: "string", required: false, default: "#3b82f6" },
    },
    example: '<BarChart data={[{name: "Jan", value: 100}]} height={300} />',
  },

  LineChart: {
    name: "LineChart",
    category: "data-viz",
    description: "Line chart visualization",
    props: {
      data: {
        type: "Array<{name: string, value: number}>",
        required: true,
      },
      height: { type: "number", required: false, default: 300 },
      color: { type: "string", required: false, default: "#3b82f6" },
    },
    example: '<LineChart data={[{name: "Jan", value: 100}]} height={300} />',
  },

  PieChart: {
    name: "PieChart",
    category: "data-viz",
    description: "Pie chart visualization",
    props: {
      data: {
        type: "Array<{name: string, value: number}>",
        required: true,
      },
      height: { type: "number", required: false, default: 300 },
    },
    example:
      '<PieChart data={[{name: "Category A", value: 100}]} height={300} />',
  },
};

// Export allowed component names for validation
export const ALLOWED_COMPONENTS = Object.keys(COMPONENT_REGISTRY);

// Export by category for AI context
export const COMPONENTS_BY_CATEGORY = {
  layout: ["Container", "Grid", "Flex", "Stack"],
  display: ["Card", "Table", "Badge", "Avatar"],
  input: ["Button", "Input", "Textarea", "Select", "Checkbox", "Switch"],
  feedback: ["Alert", "Progress", "Spinner"],
  navigation: ["Navbar", "Sidebar", "Tabs", "Breadcrumb"],
  overlay: ["Modal", "Drawer"],
  "data-viz": ["BarChart", "LineChart", "PieChart"],
};
