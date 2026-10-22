import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './dialog';

const overflow = () => getComputedStyle(document.body).overflow;

function Sample({ open, closeLabel }: { open: boolean; closeLabel?: string }) {
  return (
    <Dialog open={open}>
      <DialogContent closeLabel={closeLabel}>
        <DialogTitle>Title</DialogTitle>
      </DialogContent>
    </Dialog>
  );
}

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
  document.documentElement.lang = '';
});

describe('Dialog body scroll lock', () => {
  it('does not lock page scroll while mounted but closed', () => {
    render(<Sample open={false} />);
    expect(overflow()).not.toBe('hidden');
  });

  it('locks while open and restores after close', () => {
    document.body.style.overflow = 'scroll';
    const { rerender } = render(<Sample open />);
    expect(overflow()).toBe('hidden');
    rerender(<Sample open={false} />);
    expect(overflow()).toBe('scroll');
  });

  it('restores on unmount while open', () => {
    const { unmount } = render(<Sample open />);
    unmount();
    expect(overflow()).not.toBe('hidden');
  });

  it('closed dialog does not react to Escape', () => {
    let calls = 0;
    render(
      <Dialog open={false} onOpenChange={() => calls++}>
        <DialogContent />
      </Dialog>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(calls).toBe(0);
  });
});

describe('Dialog semantics', () => {
  it('exposes role=dialog with aria-modal=true', () => {
    render(<Sample open />);
    expect(screen.getByRole('dialog').getAttribute('aria-modal')).toBe('true');
  });

  it('lets callers override role and aria-modal', () => {
    render(
      <Dialog open>
        <DialogContent role="alertdialog" aria-modal={false} />
      </Dialog>
    );
    const el = screen.getByRole('alertdialog');
    expect(el.getAttribute('aria-modal')).toBe('false');
  });
});

describe('Dialog close button label', () => {
  it('defaults to English', () => {
    render(<Sample open />);
    expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy();
  });

  it('defaults from the document locale', () => {
    document.documentElement.lang = 'ru-RU';
    render(<Sample open />);
    expect(screen.getByRole('button', { name: 'Закрыть' })).toBeTruthy();
  });

  it('is set by the closeLabel prop', () => {
    document.documentElement.lang = 'ru';
    render(<Sample open closeLabel="Fermer" />);
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeTruthy();
  });

  it('trigger still opens an uncontrolled dialog', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent />
      </Dialog>
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(overflow()).toBe('hidden');
  });
});
