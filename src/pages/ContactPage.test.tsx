import * as React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import ContactPage from "./ContactPage";
import { LanguageProvider } from "@/i18n/LanguageContext";

const mockToast = vi.fn();
const mockMutateAsync = vi.fn();
const ROUTER_FUTURE_FLAGS = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

vi.mock("@/features/leads/hooks", () => ({
  useCreateLeadMutation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

vi.mock("@/components/ui/select", () => {
  const SelectTrigger = ({ children }: { children: React.ReactNode }) => children;
  const SelectValue = ({ placeholder }: { placeholder?: string }) => (
    <span data-placeholder={placeholder} />
  );
  const SelectContent = ({ children }: { children: React.ReactNode }) => children;
  const SelectItem = ({ children }: { value: string; children: React.ReactNode }) => children;

  return {
    Select: ({
      value,
      onValueChange,
      children,
    }: {
      value: string;
      onValueChange: (value: string) => void;
      children: React.ReactNode;
    }) => {
      const childArray = React.Children.toArray(children);
      const trigger = childArray.find((child) => React.isValidElement(child) && child.type === SelectTrigger);
      const content = childArray.find((child) => React.isValidElement(child) && child.type === SelectContent);

      const placeholder = React.isValidElement(trigger)
        && React.isValidElement(trigger.props.children)
        && "placeholder" in trigger.props.children.props
        ? trigger.props.children.props.placeholder as string
        : undefined;

      const options = React.isValidElement(content)
        ? React.Children.toArray(content.props.children)
            .filter(React.isValidElement)
            .map((item) => ({
              value: item.props.value as string,
              label: item.props.children,
            }))
        : [];

      return (
        <select
          role="combobox"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    },
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
  };
});

const renderContactPage = () => {
  render(
    <MemoryRouter future={ROUTER_FUTURE_FLAGS}>
      <LanguageProvider>
        <ContactPage />
      </LanguageProvider>
    </MemoryRouter>,
  );
};

const selectInterest = async (value: string) => {
  fireEvent.change(screen.getByRole("combobox"), {
    target: { value },
  });
};

const fillRequiredFields = async (overrides?: Partial<{
  name: string;
  email: string;
  phone: string;
  country: string;
  interest: string;
}>) => {
  fireEvent.change(screen.getByLabelText(/nombre/i), {
    target: { value: overrides?.name ?? "Jane Doe" },
  });
  fireEvent.change(screen.getByLabelText(/^email/i), {
    target: { value: overrides?.email ?? "jane@test.com" },
  });
  fireEvent.change(screen.getByLabelText(/teléfono/i), {
    target: { value: overrides?.phone ?? "+593999999999" },
  });
  fireEvent.change(screen.getByLabelText(/país/i), {
    target: { value: overrides?.country ?? "Ecuador" },
  });

  if (overrides?.interest !== null) {
    await selectInterest(overrides?.interest ?? "financing");
  }
};

describe("ContactPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits all required fields and allows an empty message", async () => {
    mockMutateAsync.mockResolvedValueOnce({});
    renderContactPage();

    await fillRequiredFields();
    fireEvent.submit(screen.getByRole("button", { name: /enviar/i }).closest("form")!);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith(expect.objectContaining({
        name: "Jane Doe",
        email: "jane@test.com",
        phone: "+593999999999",
        country: "Ecuador",
        interest: "financing",
        message: null,
        honeypot: "",
        startedAt: expect.any(Number),
      }));
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: "Mensaje enviado",
      description: "Nos pondremos en contacto contigo pronto.",
    });
  });

  it("blocks submit when a required field is missing", async () => {
    renderContactPage();

    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: "Jane Doe" } });
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: "jane@test.com" } });
    fireEvent.change(screen.getByLabelText(/teléfono/i), { target: { value: "+593999999999" } });
    fireEvent.change(screen.getByLabelText(/país/i), { target: { value: "Ecuador" } });

    fireEvent.submit(screen.getByRole("button", { name: /enviar/i }).closest("form")!);

    await waitFor(() => {
      expect(screen.getByText(/selecciona tu interes/i)).toBeInTheDocument();
    });

    expect(mockMutateAsync).not.toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Error",
        variant: "destructive",
      }),
    );
  });

  it("blocks submit when phone format is invalid", async () => {
    renderContactPage();

    await fillRequiredFields({ phone: "abc123" });
    fireEvent.submit(screen.getByRole("button", { name: /enviar/i }).closest("form")!);

    await waitFor(() => {
      expect(screen.getByText(/ingresa un telefono valido/i)).toBeInTheDocument();
    });

    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it("shows an error toast when the request fails", async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error("Insert failed"));
    renderContactPage();

    await fillRequiredFields({ interest: "miami" });
    fireEvent.change(screen.getByLabelText(/mensaje/i), {
      target: { value: "Quiero invertir." },
    });
    fireEvent.submit(screen.getByRole("button", { name: /enviar/i }).closest("form")!);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Insert failed",
        variant: "destructive",
      });
    });
  });
});
