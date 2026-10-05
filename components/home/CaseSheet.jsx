import Icon from '@/components/shared/Icon';
import CaseSheetControls from '@/components/behaviour/CaseSheetControls';

// The case sheet: a case write-up opened from the register or a sector, copied in by CaseSheetControls.
export default function CaseSheet() {
  return (
    <dialog className="sheet sheet--case" id="case-sheet" aria-label="Case study">
      <div className="sheet__bar">
        <p className="sheet__line">Case study</p>
        <button className="sheet__close" type="button" data-close=""><Icon name="close" /><span className="vh">Close</span></button>
      </div>
      <div className="sheet__body" id="case-sheet-body" />
      <CaseSheetControls />
    </dialog>
  );
}
