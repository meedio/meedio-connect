import Switch from '@shared/components/Switch/Switch';

interface RoomSidebarToggleProps {
  label: string;
  isChecked: boolean;
  onChange: (state: boolean) => void;
  dataTestId?: string;
  loading?: boolean;
  disabled?: boolean;
}

const RoomSidebarToggle = ({ label, isChecked, onChange, dataTestId, loading, disabled }: RoomSidebarToggleProps) => (
  <div className="flex w-full justify-between">
    <span className="text-sm leading-5 text-black">{label}</span>
    <Switch checked={isChecked} onChange={onChange} dataTestId={dataTestId} isLoading={loading} disabled={disabled} />
  </div>
);

export default RoomSidebarToggle;
